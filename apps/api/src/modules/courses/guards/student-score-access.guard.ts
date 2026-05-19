import { UserRole } from '@lms/shared-types';
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
 * StudentScoreAccessGuard
 *
 * Protects routes that expose a specific student's assignment scores.
 * Route must have both :studentId and :assignmentId in params.
 *
 * Allows:
 *  - The student themselves
 *  - A parent with a verified ParentStudentLink to that student
 *  - The teacher who owns the course the assignment belongs to
 *  - Staff (SUPER_ADMIN, ASSISTANT_ADMIN)
 */
@Injectable()
export class StudentScoreAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IUser | undefined = request.user;

    if (!user) throw new ForbiddenException('Authentication required.');

    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    const { studentId, assignmentId } = request.params;

    // Student accessing their own score
    if (user.role === UserRole.STUDENT && user.id === studentId) {
      return true;
    }

    // Resolve assignment → course for teacher check
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        lesson: {
          select: {
            chapter: {
              select: {
                course: { select: { teacherUserId: true } },
              },
            },
          },
        },
      },
    });

    if (!assignment) throw new NotFoundException(`Assignment #${assignmentId} not found`);

    const teacherUserId = assignment.lesson.chapter.course.teacherUserId;

    // Teacher who owns the course
    if (user.role === UserRole.TEACHER && user.id === teacherUserId) {
      return true;
    }

    // Parent with a verified link to the student
    if (user.role === UserRole.PARENT) {
      const link = await this.prisma.parentStudentLink.findFirst({
        where: {
          parentUserId: user.id,
          studentUserId: studentId,
        },
        select: { id: true },
      });

      if (link) return true;
    }

    throw new ForbiddenException("You do not have permission to view this student's scores.");
  }
}
