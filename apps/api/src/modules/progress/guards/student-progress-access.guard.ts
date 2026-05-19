import { UserRole, EnrollmentStatus } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

/**
 * StudentProgressAccessGuard
 *
 * Protects cross-user progress and score endpoints where a target student's ID
 * is explicitly provided in the URL (`:studentId`).
 *
 * Enforces:
 *   STUDENT       → allowed ONLY if they are requesting their own progress (`user.id === studentId`)
 *   PARENT        → allowed ONLY if there is a verified relationship in the database (`ParentStudentLink`)
 *   TEACHER       → allowed ONLY if they are the owner of the course (`course.teacherUserId === user.id`)
 *   SUPER_ADMIN / ASSISTANT_ADMIN → always allowed (staff bypass)
 *
 * Route Requirements:
 *   - Must define `:studentId` in the path parameters.
 *   - Can define `:courseId`, `:assignmentId`, or `:lessonId` to check a specific entity context.
 *   - If none is provided, acts as a general progress access guard for that student.
 *
 * Applied to:
 *   GET  /students/:studentId/progress/courses                      (cross-user all-courses progress summary)
 *   GET  /students/:studentId/progress/courses/:courseId            (cross-user course summary)
 *   GET  /students/:studentId/progress/courses/:courseId/lessons    (cross-user lesson statuses)
 *   POST /students/:studentId/progress/lessons/:lessonId/complete    (manual lesson complete by teacher/staff)
 *   POST /students/:studentId/progress/lessons/:lessonId/watch       (manual watch pct update by teacher/staff)
 *   GET  /students/:studentId/assignments/:assignmentId/best-score  (cross-user assignment best score)
 */
@Injectable()
export class StudentProgressAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser | undefined = request.user;

    if (!user) throw new UnauthorizedException('Authentication required.');

    // 1. Staff bypass — no DB work needed
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    const { studentId, assignmentId, courseId, lessonId } = request.params;

    // 2. Student viewing their own progress/score check (fail fast if not self)
    if (user.role === UserRole.STUDENT) {
      if (user.id === studentId) {
        return true;
      }
      throw new ForbiddenException('You can only access your own progress.');
    }

    // 3. Handle General Query (no courseId, assignmentId, or lessonId)
    const isGeneralQuery = !courseId && !assignmentId && !lessonId;

    if (isGeneralQuery) {
      // Teachers can view the general progress only if they teach at least one course the student is enrolled in
      if (user.role === UserRole.TEACHER) {
        const hasRelationship = await this.prisma.enrollment.findFirst({
          where: {
            studentUserId: studentId,
            status: EnrollmentStatus.ACTIVE,
            course: { teacherUserId: user.id },
          },
          select: { id: true },
        });

        if (!hasRelationship) {
          throw new ForbiddenException(
            "You do not have permission to access this student's progress summaries.",
          );
        }
        return true;
      }

      // Parents can view the general progress only if they have a verified relationship with the student
      if (user.role === UserRole.PARENT) {
        const link = await this.prisma.parentStudentLink.findFirst({
          where: { parentUserId: user.id, studentUserId: studentId },
          select: { id: true },
        });

        if (!link) {
          throw new ForbiddenException(
            "You do not have permission to view this student's progress.",
          );
        }
        return true;
      }

      throw new ForbiddenException('Access denied.');
    }

    // 4. Resolve the course context and teacherUserId for target specific entity checks
    let teacherUserId: string | undefined;
    let resolvedCourseId: string | undefined;

    if (courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { teacherUserId: true },
      });

      if (!course) {
        throw new NotFoundException(`Course #${courseId} not found`);
      }
      teacherUserId = course.teacherUserId;
      resolvedCourseId = courseId;
    } else if (assignmentId) {
      const assignment = await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: {
          archivedAt: true,
          lesson: {
            select: {
              chapter: {
                select: {
                  courseId: true,
                  course: { select: { teacherUserId: true } },
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        throw new NotFoundException(`Assignment #${assignmentId} not found`);
      }
      resolvedCourseId = assignment.lesson.chapter.courseId;
      teacherUserId = assignment.lesson.chapter.course.teacherUserId;
    } else if (lessonId) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          archivedAt: true,
          chapter: {
            select: {
              courseId: true,
              course: { select: { teacherUserId: true } },
            },
          },
        },
      });

      if (!lesson) {
        throw new NotFoundException(`Lesson #${lessonId} not found or archived`);
      }
      resolvedCourseId = lesson.chapter.courseId;
      teacherUserId = lesson.chapter.course.teacherUserId;
    }

    // Explicit route configuration validation
    if (!teacherUserId || !resolvedCourseId) {
      throw new ForbiddenException('Access denied.');
    }

    // Verify target student has an ACTIVE enrollment in this course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentUserId_courseId: {
          studentUserId: studentId,
          courseId: resolvedCourseId,
        },
      },
      select: { status: true },
    });

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new ForbiddenException('Student is not actively enrolled in this course.');
    }

    // 4. Teacher who owns the course check
    if (user.role === UserRole.TEACHER) {
      if (user.id === teacherUserId) {
        return true;
      }
      throw new ForbiddenException(
        'You must be the owner of the course to access student progress.',
      );
    }

    // 5. Parent with a verified ParentStudentLink to the target student check
    if (user.role === UserRole.PARENT) {
      const link = await this.prisma.parentStudentLink.findFirst({
        where: { parentUserId: user.id, studentUserId: studentId },
        select: { id: true },
      });

      if (link) return true;
    }

    throw new ForbiddenException(
      "You do not have permission to view this student's progress or scores.",
    );
  }
}
