import { EnrollmentStatus } from '@lms/shared-types';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { CourseProgressService } from './course-progress.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseProgressService: CourseProgressService,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /**
   * Resolves the courseId for a lesson via its chapter join.
   * Throws NotFoundException if the lesson is archived or doesn't exist.
   */
  private async resolveCourseId(lessonId: string): Promise<string> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        archivedAt: true,
        chapter: { select: { courseId: true } },
      },
    });

    if (!lesson || lesson.archivedAt) {
      throw new NotFoundException(`Lesson #${lessonId} not found or archived`);
    }

    return lesson.chapter.courseId;
  }

  /**
   * Asserts the student is actively enrolled before allowing any progress write.
   * This is a service-level safety net — the EnrollmentGuard handles it at the
   * HTTP layer, but double-checking here protects event-driven calls too.
   */
  private async assertEnrolled(studentUserId: string, courseId: string): Promise<void> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      select: { status: true },
    });

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new ForbiddenException('Student is not actively enrolled in this course.');
    }
  }

  // ─── PUBLIC METHODS ───────────────────────────────────────────────────────────

  /**
   * 1 — updateWatchPct(studentUserId, lessonId, pct)
   *
   * Upserts the student's video watch percentage for a lesson.
   * Sets videoCompletedAt when pct reaches 100 (only on the first time).
   *
   * Does NOT mark the lesson as completed — watching 100% and completing are
   * intentionally separated so a student can also complete via the assignment
   * path without having watched the full video.
   */
  async updateWatchPct(studentUserId: string, lessonId: string, pct: number) {
    const courseId = await this.resolveCourseId(lessonId);
    await this.assertEnrolled(studentUserId, courseId);

    // Only set videoCompletedAt if this is the first time reaching 100%.
    // We can't use upsert's update for this conditional, so we fetch first.
    const existing = await this.prisma.lessonProgress.findUnique({
      where: { studentUserId_lessonId: { studentUserId, lessonId } },
      select: { videoCompletedAt: true },
    });

    const reachedEnd = pct === 100;
    const alreadyCompleted = !!existing?.videoCompletedAt;

    return this.prisma.lessonProgress.upsert({
      where: { studentUserId_lessonId: { studentUserId, lessonId } },
      create: {
        studentUserId,
        lessonId,
        videoWatchedPct: pct,
        videoCompletedAt: reachedEnd ? new Date() : null,
      },
      update: {
        videoWatchedPct: pct,
        // Only stamp videoCompletedAt on the first 100% — never overwrite with null
        ...(reachedEnd && !alreadyCompleted && { videoCompletedAt: new Date() }),
      },
    });
  }

  /**
   * 2 — complete(studentUserId, lessonId)
   *
   * Marks a lesson as completed (isCompleted = true).
   * IDEMPOTENT: if already completed, returns existing row without re-incrementing
   * the course progress counter.
   *
   * Delegates progress counter update to CourseProgressService.increment(),
   * which also recalculates progressPct and sets completedAt if at 100%.
   */
  async complete(studentUserId: string, lessonId: string, override = false) {
    const courseId = await this.resolveCourseId(lessonId);
    if (!override) {
      // Only check enrollment for self-service student calls
      await this.assertEnrolled(studentUserId, courseId);
    }

    // Check for existing completion — upsert can't express conditional logic
    const existing = await this.prisma.lessonProgress.findUnique({
      where: { studentUserId_lessonId: { studentUserId, lessonId } },
      select: { isCompleted: true },
    });

    // Idempotency guard — do nothing if already completed
    if (existing?.isCompleted) {
      return existing;
    }

    const now = new Date();

    const [progress] = await Promise.all([
      this.prisma.lessonProgress.upsert({
        where: { studentUserId_lessonId: { studentUserId, lessonId } },
        create: {
          studentUserId,
          lessonId,
          isCompleted: true,
          completedAt: now,
          // Video pct is unknown at this point — leave at default 0
        },
        update: {
          isCompleted: true,
          completedAt: now,
        },
      }),
      // Increment course progress counter (recalculates progressPct, sets completedAt if 100%)
      this.courseProgressService.increment(studentUserId, courseId, lessonId),
    ]);

    return progress;
  }

  /**
   * 3 — findAllByCourse(studentUserId, courseId)
   *
   * Returns all LessonProgress rows for a student within a course.
   * Fetches lesson IDs from the course's active chapters so the result
   * includes rows for every lesson — even those with no progress yet
   * (returned as null in the map; callers can treat absent = 0%).
   */
  async findAllByCourse(studentUserId: string, courseId: string) {
    // Pull all active lessons for this course so we can build a complete map
    const lessons = await this.prisma.lesson.findMany({
      where: {
        archivedAt: null,
        chapter: { courseId, archivedAt: null },
      },
      select: {
        id: true,
        title: true,
        orderIndex: true,
        chapter: { select: { id: true, title: true, orderIndex: true } },
      },
      orderBy: [{ chapter: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
    });

    const lessonIds = lessons.map((l) => l.id);

    const progressRows = await this.prisma.lessonProgress.findMany({
      where: { studentUserId, lessonId: { in: lessonIds } },
    });

    const progressByLessonId = new Map(progressRows.map((r) => [r.lessonId, r]));

    // Merge lessons with their progress (null if not started)
    return lessons.map((lesson) => ({
      lessonId: lesson.id,
      title: lesson.title,
      orderIndex: lesson.orderIndex,
      chapter: lesson.chapter,
      progress: progressByLessonId.get(lesson.id) ?? null,
    }));
  }
}
