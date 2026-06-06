import { UserRole } from '@lms/shared-types';
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
import { EnrollmentService } from '../../enrollments/enrollment.service';

/**
 * EnrollmentGuard
 *
 * Asserts whether the requesting user is allowed to access course-level content.
 *
 * Reads courseId from:
 *   req.params.courseId  — progress routes  (/progress/courses/:courseId/...)
 *   req.params.id        — fallback for course routes (/courses/:id/chapters)
 *
 * Enforces:
 *   STUDENT            → ACTIVE enrollment + expiry not passed
 *   TEACHER            → must be the course owner
 *   SUPER_ADMIN /
 *   ASSISTANT_ADMIN    → always allowed
 *
 * Currently applied to:
 *   GET /progress/courses/:courseId
 *   GET /progress/courses/:courseId/lessons
 *   GET /progress/courses/:courseId/students  (teacher bypass)
 */
@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    if (!user) throw new UnauthorizedException('Authentication required.');

    // Works on both /progress/courses/:courseId and /courses/:id/...
    const courseId: string = request.params.courseId ?? request.params.id;

    if (!courseId) {
      throw new NotFoundException('Course ID is required.');
    }

    // Staff always pass
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherUserId: true },
    });

    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    if (user.role === UserRole.TEACHER && course.teacherUserId === user.id) {
      return true;
    }

    // Delegates to EnrollmentService.isEnrolled() which checks both
    // status === ACTIVE and expiryDate hasn't passed yet
    const enrolled = await this.enrollmentService.isEnrolled(user.id, courseId);

    if (!enrolled) {
      throw new ForbiddenException('You must be enrolled in this course to access its content.');
    }

    return true;
  }
}
