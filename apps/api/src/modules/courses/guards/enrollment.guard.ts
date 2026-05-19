import { UserRole, EnrollmentStatus } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;
    const courseId: string = request.params.courseId;

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
