import { UserRole, EnrollmentStatus } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

/**
 * LessonAccessGuard — applied ONLY to GET /lessons/:lessonId.
 *
 * Resolves the parent courseId through the lesson→chapter join (one DB hit),
 * then checks:
 *  - SUPER_ADMIN / ASSISTANT_ADMIN: always pass
 *  - TEACHER who owns the course: passes
 *  - STUDENT with ACTIVE enrollment in the course: passes
 *  - PARENT: blocked — parents are not enrolled directly.
 *    Future: add ParentStudentLink lookup here if parents need read access.
 *  - Everyone else: 403
 */
@Injectable()
export class LessonAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser | undefined = request.user;

    // Guard against unauthenticated requests (e.g. if JwtAuthGuard is made optional)
    if (!user) throw new ForbiddenException('Authentication required.');

    // Staff always pass
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    const lessonId: string = request.params.lessonId;

    // Single DB hit: resolve the lesson and its parent course in one query
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

    if (!lesson || lesson.archivedAt) {
      throw new NotFoundException(`Lesson #${lessonId} not found or archived`);
    }

    const { courseId, course } = lesson.chapter;

    // The course's own teacher passes
    if (user.role === UserRole.TEACHER && course.teacherUserId === user.id) {
      return true;
    }

    // Student must have an ACTIVE enrollment in the parent course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentUserId_courseId: {
          studentUserId: user.id,
          courseId,
        },
      },
      select: { status: true },
    });

    if (enrollment?.status === EnrollmentStatus.ACTIVE) {
      return true;
    }

    throw new ForbiddenException('You must be enrolled in this course to access its content.');
  }
}
