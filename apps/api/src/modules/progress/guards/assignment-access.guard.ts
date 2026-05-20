import { EnrollmentStatus, UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

/**
 * AssignmentAccessGuard
 *
 * Resolves the parent courseId from the assignment → lesson → chapter chain,
 * then enforces:
 *
 *   STUDENT       → must have an ACTIVE enrollment in the course
 *   TEACHER       → must be the course owner (teacherUserId === user.id)
 *   SUPER_ADMIN / ASSISTANT_ADMIN → always allowed
 *
 * Applied to:
 *   GET  /assignments/:id/attempts        (student own history)
 *   GET  /assignments/:id/best-score      (student own best)
 *   GET  /assignments/:id/attempts/all    (teacher all-students view)
 *
 * NOTE: submit (POST /assignments/:id/attempt) has its enrollment check
 * inside AssignmentAttemptService.submit() — it reuses the assignment→course
 * join that's already loaded for grading, so no extra query is needed there.
 */
@Injectable()
export class AssignmentAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: IUser = req.user;
    const assignmentId: string = req.params.id;

    if (!user) throw new UnauthorizedException('Authentication required.');

    // Staff bypass — no further checks needed
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    // Resolve courseId + teacherUserId from assignment in one join
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
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
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment #${assignmentId} not found`);
    }

    const { courseId, course } = assignment.lesson.chapter;

    if (user.role === UserRole.TEACHER) {
      if (course.teacherUserId !== user.id) {
        throw new ForbiddenException(
          'You are not the owner of the course this assignment belongs to.',
        );
      }
      return true;
    }

    // STUDENT — must have an active enrollment
    if (user.role === UserRole.STUDENT) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { studentUserId_courseId: { studentUserId: user.id, courseId } },
        select: { status: true },
      });

      if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
        throw new ForbiddenException(
          'You must be actively enrolled in this course to access assignment data.',
        );
      }

      return true;
    }

    if (user.role === UserRole.PARENT) {
      throw new ForbiddenException('Parents cannot access assignment data.');
    }

    throw new ForbiddenException('Access denied.');
  }
}
