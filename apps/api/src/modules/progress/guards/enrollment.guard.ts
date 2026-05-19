import { UserRole, EnrollmentStatus } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

/**
 * EnrollmentGuard
 *
 * Asserts whether the requesting user is allowed to access course-level progress.
 * Expects `courseId` as a route parameter (`:courseId`).
 *
 * Enforces:
 *   STUDENT       → must have an ACTIVE enrollment in the course (status === 'ACTIVE')
 *   TEACHER       → must be the course owner (course.teacherUserId === user.id)
 *   SUPER_ADMIN / ASSISTANT_ADMIN → always allowed (staff bypass)
 *
 * Applied to:
 *   GET  /progress/courses/:courseId            (course progress summary)
 *   GET  /progress/courses/:courseId/lessons    (lesson progress statuses list)
 */
@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;
    const courseId: string = request.params.courseId;

    if (!user) throw new UnauthorizedException('Authentication required.');

    // Staff always pass — they can see everything
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    // Verify the course exists before any ownership/enrollment check
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherUserId: true },
    });

    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    // The course's own teacher passes
    if (user.role === UserRole.TEACHER && course.teacherUserId === user.id) {
      return true;
    }

    // Student (or parent acting on behalf) must have an ACTIVE enrollment
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
