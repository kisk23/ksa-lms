import { UserRole, EnrollmentStatus } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

/**
 * AssignmentAccessGuard
 *
 * Resolves the parent courseId + teacherUserId through:
 * 1. lessonId (from params)
 * 2. assignmentId (from params)
 * 3. questionId (from params)
 *
 * On success, attaches { courseId, teacherUserId } to request.courseContext
 * so the service layer can skip the redundant ownership DB query.
 */
@Injectable()
export class AssignmentAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser | undefined = request.user;

    if (!user) throw new ForbiddenException('Authentication required.');

    // Staff always pass — no context needed, service skips ownership check too
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    const { lessonId, assignmentId, questionId } = request.params;
    let resolvedCourseId: string | undefined;
    let teacherUserId: string | undefined;

    if (lessonId) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          chapter: {
            select: {
              courseId: true,
              course: { select: { teacherUserId: true } },
            },
          },
        },
      });
      if (!lesson) throw new NotFoundException(`Lesson #${lessonId} not found`);
      resolvedCourseId = lesson.chapter.courseId;
      teacherUserId = lesson.chapter.course.teacherUserId;
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
      if (!assignment) throw new NotFoundException(`Assignment #${assignmentId} not found`);

      // Archived assignments are invisible to everyone (staff already returned true above)
      // We check this BEFORE ownership to avoid leaking existence to foreign teachers
      if (assignment.archivedAt) {
        throw new NotFoundException(`Assignment #${assignmentId} not found`);
      }

      resolvedCourseId = assignment.lesson.chapter.courseId;
      teacherUserId = assignment.lesson.chapter.course.teacherUserId;
    } else if (questionId) {
      const question = await this.prisma.question.findUnique({
        where: { id: questionId },
        select: {
          assignment: {
            select: {
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
          },
        },
      });
      if (!question) throw new NotFoundException(`Question #${questionId} not found`);
      resolvedCourseId = question.assignment.lesson.chapter.courseId;
      teacherUserId = question.assignment.lesson.chapter.course.teacherUserId;
    }

    if (!resolvedCourseId || !teacherUserId) {
      throw new BadRequestException('Could not resolve course context for assignment access.');
    }

    // Attach to request so the service can skip its own ownership DB query
    request.courseContext = { courseId: resolvedCourseId, teacherUserId };

    // Owner teacher passes for both reads and writes
    if (user.role === UserRole.TEACHER && teacherUserId === user.id) {
      return true;
    }

    // Students can only read — check active enrollment
    if (request.method === 'GET') {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentUserId_courseId: {
            studentUserId: user.id,
            courseId: resolvedCourseId,
          },
        },
        select: { status: true },
      });

      if (enrollment?.status === EnrollmentStatus.ACTIVE) {
        return true;
      }
    }

    const action = request.method === 'GET' ? 'access' : 'modify';
    throw new ForbiddenException(`You do not have permission to ${action} this assignment.`);
  }
}
