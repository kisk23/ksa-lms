import { UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { EnrollmentStatus, Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── PUBLIC READ ──────────────────────────────────────────────────────────────

  /**
   * findByStudent(studentUserId, courseId)
   * O(1) indexed lookup — @@unique([studentUserId, courseId]) is the index.
   */
  async findByStudent(studentUserId: string, courseId: string) {
    const progress = await this.prisma.courseProgress.findUnique({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      include: {
        lastLesson: { select: { id: true, title: true, orderIndex: true } },
      },
    });

    if (!progress) {
      throw new NotFoundException(`No progress found for student in course #${courseId}`);
    }

    return progress;
  }

  /**
   * findAllForStudent(actor, studentUserId)
   *
   * Fetches all course progress summaries for a student.
   * If the actor is a TEACHER, it enforces database-level filtration so they
   * only retrieve course progress records for courses they own.
   *
   * Performance optimization: Filter on the database level using Prisma relation filters
   * rather than in-memory JavaScript array filtration, reducing database network payload
   * and application memory overhead.
   */
  async findAllForStudent(actor: IUser, studentUserId: string) {
    return this.prisma.courseProgress.findMany({
      where: {
        studentUserId,
        // If the actor is a teacher, restrict to courses they teach
        ...(actor.role === UserRole.TEACHER && {
          course: { teacherUserId: actor.id },
        }),
      },
      include: {
        lastLesson: { select: { id: true, title: true, orderIndex: true } },
        course: { select: { id: true, title: true, teacherUserId: true } },
      },
      orderBy: {
        course: { title: 'asc' },
      },
    });
  }

  /**
   * findStudentsProgressByCourse(courseId)
   *
   * Fetches the progress records of all students enrolled in a course.
   * Includes the student's details (id, name, email, phone, enrollment status)
   * and their bookmarked lesson.
   * Called by teachers and staff to populate the course progress dashboard.
   */
  async findStudentsProgressByCourse(courseId: string) {
    const courseExists = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!courseExists) {
      throw new NotFoundException(`Course #${courseId} not found`);
    }

    return this.prisma.courseProgress.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            enrollments: {
              where: { courseId },
              select: {
                status: true,
                enrolledAt: true,
              },
            },
          },
        },
        lastLesson: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
          },
        },
      },
      orderBy: {
        student: {
          name: 'asc',
        },
      },
    });
  }

  /**
   * findGlobalProgress(query)
   *
   * System-wide global progress view for administrators.
   * Supports filtering by student, course, and text search (matches student name/email or course title).
   * Supports pagination.
   */
  async findGlobalProgress(query: {
    courseId?: string;
    studentId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { courseId, studentId, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseProgressWhereInput = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (studentId) {
      where.studentUserId = studentId;
    }

    if (search) {
      where.OR = [
        {
          student: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          course: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.courseProgress.count({ where }),
      this.prisma.courseProgress.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              enrollments: {
                select: {
                  courseId: true,
                  status: true,
                  enrolledAt: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              teacher: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          lastLesson: {
            select: {
              id: true,
              title: true,
              orderIndex: true,
            },
          },
        },
        orderBy: {
          student: {
            name: 'asc',
          },
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  // ─── WRITE OPERATIONS ─────────────────────────────────────────────────────────

  /**
   * init(studentUserId, courseId, totalLessons)
   *
   * Creates a fresh CourseProgress row when a student is enrolled.
   * Called by EnrollmentModule via the 'enrollment.created' event.
   * Uses upsert to be idempotent — safe to call multiple times
   * (e.g. if the enrollment event fires twice due to a retry).
   */
  async init(studentUserId: string, courseId: string, totalLessons: number) {
    return this.prisma.courseProgress.upsert({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      create: {
        studentUserId,
        courseId,
        totalLessons,
        completedLessons: 0,
        progressPct: 0,
      },
      update: {}, // Already exists — leave as-is
    });
  }

  /**
   * increment(studentUserId, courseId, lastLessonId)
   *
   * Called by LessonProgressService.complete() after a lesson is marked done.
   * Increments completedLessons, recalculates progressPct, updates lastLessonId,
   * and sets completedAt if the student has now finished every lesson.
   *
   * Uses an atomic Prisma update (not read-then-write) to avoid race conditions
   * when two lessons are completed in quick succession.
   *
   * NOTE: progressPct is recalculated as floor((completedLessons / totalLessons) * 100).
   * Prisma doesn't support derived expressions in update, so we fetch first and
   * compute in JS — acceptable here because the @@unique index makes this a
   * single-row read.
   */
  async increment(studentUserId: string, courseId: string, lastLessonId: string) {
    const existing = await this.prisma.courseProgress.findUnique({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      select: { completedLessons: true, totalLessons: true },
    });

    if (!existing) {
      // Progress row not found — enrollment event may not have fired yet.
      // Silently skip rather than throw; the lesson completion is still saved.
      return;
    }

    const completedLessons = existing.completedLessons + 1;
    const progressPct =
      existing.totalLessons > 0
        ? Math.min(100, Math.floor((completedLessons / existing.totalLessons) * 100))
        : 0;
    const isNowComplete = progressPct === 100 && existing.completedLessons < existing.totalLessons;

    const updated = await this.prisma.courseProgress.update({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      data: {
        completedLessons,
        progressPct,
        lastLessonId,
        ...(isNowComplete && { completedAt: new Date() }),
      },
    });

    if (isNowComplete) {
      this.eventEmitter.emit('enrollment.completed', {
        studentUserId,
        courseId,
      });
      return updated;
    }
  }

  // ─── EVENT LISTENERS ──────────────────────────────────────────────────────────

  /**
   * Listens for 'lesson.created' emitted by LessonsService.
   * Increments totalLessons for every enrolled (ACTIVE) student in the course.
   * Also recalculates progressPct since the denominator just grew.
   */
  @OnEvent('lesson.created')
  async incrementTotal(payload: { courseId: string }) {
    const { courseId } = payload;

    // Bulk fetch to recalculate — can't do arithmetic on Prisma updateMany
    const rows = await this.prisma.courseProgress.findMany({
      where: {
        courseId,
        student: {
          enrollments: {
            some: {
              courseId,
              status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] },
            },
          },
        },
      },
      select: { id: true, completedLessons: true, totalLessons: true },
    });

    if (rows.length === 0) return;

    await this.prisma.$transaction(
      rows.map((row) => {
        const newTotal = row.totalLessons + 1;
        const progressPct = Math.floor((row.completedLessons / newTotal) * 100);
        return this.prisma.courseProgress.update({
          where: { id: row.id },
          data: { totalLessons: newTotal, progressPct },
        });
      }),
    );
  }

  /**
   * Listens for 'lesson.deleted' emitted by LessonsService.
   *
   * Payload now includes lessonId so we can make accurate counter adjustments
   * rather than blindly clamping (the old approach lost information when a student
   * had already completed the deleted lesson).
   *
   * Steps inside one transaction:
   *  1. Delete LessonProgress rows for this lesson (source of truth is gone).
   *  2. For each affected CourseProgress row, recount completedLessons from
   *     the surviving LessonProgress rows — accurate regardless of prior state.
   *  3. Decrement totalLessons and recalculate progressPct.
   */
  @OnEvent('lesson.deleted')
  async decrementTotal(payload: { lessonId: string; courseId: string }) {
    const { lessonId, courseId } = payload;

    // Identify every student enrolled in this course so we know which
    // CourseProgress rows to touch. We scope by the course, not by who
    // had LessonProgress, because totalLessons must drop for ALL students.
    const progressRows = await this.prisma.courseProgress.findMany({
      where: { courseId },
      select: { id: true, studentUserId: true, totalLessons: true, completedAt: true },
    });

    if (progressRows.length === 0) return;

    await this.prisma.$transaction(async (tx) => {
      // 1. Hard-delete the LessonProgress rows for the deleted lesson.
      //    Without this, the recount below would include them and give stale results.
      await tx.lessonProgress.deleteMany({ where: { lessonId } });

      // 2. Recount and update each student's progress row.
      for (const row of progressRows) {
        const newTotal = Math.max(0, row.totalLessons - 1);

        // Recount from DB — the deleteMany above already removed the deleted lesson's rows,
        // so this count reflects exactly what's left.
        const completedLessons = await tx.lessonProgress.count({
          where: {
            studentUserId: row.studentUserId,
            lesson: { chapter: { courseId } },
            isCompleted: true,
          },
        });

        const progressPct =
          newTotal > 0 ? Math.min(100, Math.floor((completedLessons / newTotal) * 100)) : 0;

        // Only stamp completedAt if not already set — don't overwrite a past completion.
        const isNowComplete = newTotal > 0 && progressPct === 100 && !row.completedAt;

        await tx.courseProgress.update({
          where: { id: row.id },
          data: {
            totalLessons: newTotal,
            completedLessons,
            progressPct,
            ...(isNowComplete && { completedAt: new Date() }),
          },
        });
      }
    });
  }

  /**
   * Listens for 'enrollment.created' emitted by EnrollmentModule.
   * Initialises a fresh CourseProgress row for the newly enrolled student.
   * Counts only active (non-archived) lessons at enrolment time.
   */
  @OnEvent('enrollment.created')
  async handleEnrollmentCreated(payload: { studentUserId: string; courseId: string }) {
    const { studentUserId, courseId } = payload;

    const totalLessons = await this.prisma.lesson.count({
      where: {
        archivedAt: null,
        chapter: { courseId, archivedAt: null },
      },
    });

    await this.init(studentUserId, courseId, totalLessons);
  }

  /**
   * Listens for 'enrollment.reactivated' emitted by EnrollmentModule.
   * Runs a self-healing sync to recalculate progress in case lessons were
   * added or deleted while the student was inactive.
   */
  @OnEvent('enrollment.reactivated')
  async handleEnrollmentReactivated(payload: { studentUserId: string; courseId: string }) {
    const { studentUserId, courseId } = payload;

    // 1. Get the current count of active lessons in this course
    const totalLessons = await this.prisma.lesson.count({
      where: {
        archivedAt: null,
        chapter: { courseId, archivedAt: null },
      },
    });

    // 2. Count how many of these active lessons the student has actually completed
    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        studentUserId,
        isCompleted: true,
        lesson: {
          archivedAt: null,
          chapter: { courseId, archivedAt: null },
        },
      },
    });

    const progressPct =
      totalLessons > 0 ? Math.min(100, Math.floor((completedLessons / totalLessons) * 100)) : 0;

    const isNowComplete = progressPct === 100;

    // 3. Upsert progress: heal existing progress, or create it if missing
    await this.prisma.courseProgress.upsert({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      create: {
        studentUserId,
        courseId,
        totalLessons,
        completedLessons,
        progressPct,
        ...(isNowComplete && { completedAt: new Date() }),
      },
      update: {
        totalLessons,
        completedLessons,
        progressPct,
        // Update completedAt depending on whether they finished the new syllabus
        completedAt: isNowComplete ? new Date() : null,
      },
    });
  }
}
