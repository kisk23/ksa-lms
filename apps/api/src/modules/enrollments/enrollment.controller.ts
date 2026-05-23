import { UserPermission, UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CreateManualEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentService } from './enrollment.service';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Permissions } from '../users/decorators/permissions.decorator';
import { PermissionsGuard } from '../users/guards/permissions.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // ─── READ ────────────────────────────────────────────────────────────────────

  /**
   * GET /enrollments/me
   *
   * Returns the authenticated student's enrollment history.
   * PENDING rows are excluded — student only sees rows they have meaningful
   * context for (ACTIVE, COMPLETED, EXPIRED, CANCELLED).
   */
  @Get('enrollments/me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: "Get the current student's enrollment history" })
  @ApiOkResponse({ description: 'Enrollment list returned successfully.' })
  findMyEnrollments(@GetCurrentUser() user: IUser) {
    return this.enrollmentService.findByStudent(user.id);
  }

  /**
   * GET /courses/:courseId/enrollments
   *
   * Lists all enrolled students for a given course.
   * Teachers can only see students in their own courses. Staff see all.
   */
  @Get('courses/:courseId/enrollments')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_READ)
  @ApiOperation({ summary: 'List enrolled students for a course (Teacher/Staff)' })
  @ApiOkResponse({ description: 'Enrollment list returned successfully.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  @ApiForbiddenResponse({ description: 'Teacher does not own this course.' })
  findByCourse(@Param('courseId') courseId: string, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.findByCourse(courseId, user);
  }

  // ─── CREATE ──────────────────────────────────────────────────────────────────

  /**
   * POST /enrollments
   *
   * Manual offline enrollment by admin or assistant.
   * Skips the payment flow — goes directly to ACTIVE.
   * Re-enrolls CANCELLED/EXPIRED/COMPLETED students by updating the existing row.
   * Emits 'enrollment.created' so ProgressModule initialises a CourseProgress row.
   */
  @Post('enrollments')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_CREATE)
  @ApiOperation({ summary: 'Manual offline enrollment (Admin/Assistant)' })
  @ApiCreatedResponse({ description: 'Student enrolled successfully.' })
  @ApiConflictResponse({
    description: 'Student is already ACTIVE or has a PENDING payment enrollment.',
  })
  @ApiBadRequestResponse({ description: 'Target user is not a student.' })
  @ApiNotFoundResponse({ description: 'Course or student not found.' })
  createManual(@Body() dto: CreateManualEnrollmentDto, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.createManual(dto, user);
  }

  // ─── CANCEL ──────────────────────────────────────────────────────────────────

  /**
   * PATCH /enrollments/:id/cancel
   *
   * Soft-cancels an enrollment (ACTIVE, COMPLETED, or EXPIRED → CANCELLED).
   * Preserves the row for audit trail and CourseProgress history.
   * Typically called by admin after a refund is processed.
   */
  @Patch('enrollments/:id/cancel')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_DELETE)
  @ApiOperation({ summary: 'Cancel an enrollment (Admin/Assistant)' })
  @ApiOkResponse({ description: 'Enrollment cancelled successfully.' })
  @ApiConflictResponse({ description: 'Enrollment is already cancelled.' })
  @ApiBadRequestResponse({ description: 'Cannot cancel a PENDING enrollment.' })
  @ApiNotFoundResponse({ description: 'Enrollment not found.' })
  cancel(@Param('id') id: string) {
    return this.enrollmentService.cancel(id);
  }
}
