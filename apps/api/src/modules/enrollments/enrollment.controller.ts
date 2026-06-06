import { UserPermission, UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
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

import {
  CreateManualEnrollmentDto,
  BulkEnrollDto,
  ExtendEnrollmentDto,
  TransferEnrollmentDto,
  AdminEnrollmentQueryDto,
} from './dto';
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
   * Returns the authenticated student's full enrollment history.
   * PENDING rows are excluded — the student only sees rows they have meaningful
   * context for (ACTIVE, COMPLETED, EXPIRED, CANCELLED).
   * Each row includes a course summary (title, thumbnail, teacher) so the
   * student home screen can be rendered without a second request.
   *
   * Access: STUDENT only — scoped to the authenticated user's own records.
   */
  @Get('enrollments/me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: "Get the student's own enrollment history" })
  @ApiOkResponse({ description: 'History returned successfully.' })
  findMyEnrollments(@GetCurrentUser() user: IUser) {
    return this.enrollmentService.findByStudent(user.id);
  }

  /**
   * GET /enrollments/:id
   *
   * Returns a single enrollment record by ID with full course and student details.
   * Ownership is enforced at the service layer:
   *   STUDENT       → may only fetch their own enrollment
   *   TEACHER       → may only fetch enrollments for courses they own
   *   SUPER_ADMIN /
   *   ASSISTANT_ADMIN → no restriction
   *
   * Access: all authenticated roles — service layer enforces ownership.
   * PermissionsGuard ensures assistant admins have ENROLLMENT_READ before proceeding.
   */
  @Get('enrollments/:id')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_READ)
  @ApiOperation({ summary: 'Get enrollment details by ID' })
  @ApiOkResponse({ description: 'Enrollment record returned successfully.' })
  @ApiForbiddenResponse({ description: 'Caller does not own this enrollment or course.' })
  @ApiNotFoundResponse({ description: 'Enrollment not found.' })
  findById(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.findById(id, user);
  }

  /**
   * GET /courses/:courseId/enrollments
   *
   * Returns all non-PENDING enrolled students for a course.
   * Used to populate the teacher's student roster view.
   * PENDING rows are excluded — those students do not yet have course access.
   *
   * Access: TEACHER (own courses only), SUPER_ADMIN, ASSISTANT_ADMIN.
   * Service layer throws 403 if a teacher tries to see another teacher's roster.
   */
  @Get('courses/:courseId/enrollments')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_READ)
  @ApiOperation({ summary: 'List students enrolled in a course' })
  @ApiOkResponse({ description: 'Roster returned successfully.' })
  @ApiForbiddenResponse({ description: 'Teacher does not own this course.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  findByCourse(@Param('courseId') courseId: string, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.findByCourse(courseId, user);
  }

  /**
   * GET /courses/:courseId/enrollments/stats
   *
   * Returns enrollment counts grouped by status for a single course.
   * Shape: { active, completed, expired, cancelled, pending, total }
   * Backed by a single groupBy query — one DB round-trip regardless of
   * how many enrollments exist.
   *
   * Access: TEACHER (own courses only), SUPER_ADMIN, ASSISTANT_ADMIN.
   * Service layer throws 403 if a teacher requests stats for another teacher's course.
   */
  @Get('courses/:courseId/enrollments/stats')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_READ)
  @ApiOperation({ summary: 'Get enrollment status distribution for a course' })
  @ApiOkResponse({ description: 'Statistics returned successfully.' })
  @ApiForbiddenResponse({ description: 'Teacher does not own this course.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  getStats(@Param('courseId') courseId: string, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.getStats(courseId, user);
  }

  /**
   * GET /admin/enrollments
   *
   * System-wide paginated enrollment view for administrators.
   * Supports filtering by studentId, courseId, status, and free-text search
   * (matches student name, student email, or course title).
   *
   * Query params: studentId?, courseId?, status?, search?, page?, limit?
   * Response includes pagination metadata: total, page, limit, totalPages.
   *
   * Access: SUPER_ADMIN, ASSISTANT_ADMIN only.
   */
  @Get('admin/enrollments')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_READ)
  @ApiOperation({ summary: 'System-wide enrollment list with filtering and pagination (Admin)' })
  @ApiOkResponse({ description: 'Paginated enrollment records returned successfully.' })
  findGlobal(@Query() query: AdminEnrollmentQueryDto) {
    return this.enrollmentService.findGlobal(query);
  }

  // ─── WRITE ───────────────────────────────────────────────────────────────────

  /**
   * POST /enrollments
   *
   * Manual offline enrollment for a single student by an admin or assistant.
   * Bypasses the payment flow entirely — enrollment goes directly to ACTIVE.
   *
   * Re-enrollment behaviour:
   *   CANCELLED / EXPIRED / COMPLETED → existing row is updated back to ACTIVE
   *   ACTIVE  → 409 Conflict
   *   PENDING → 409 Conflict (use payment flow instead)
   *
   * On success emits 'enrollment.created' (fresh row) or 'enrollment.reactivated'
   * (existing row updated) so CourseProgressService handles progress accordingly.
   *
   * Access: SUPER_ADMIN, ASSISTANT_ADMIN only.
   */
  @Post('enrollments')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_CREATE)
  @ApiOperation({ summary: 'Manual offline enrollment for a single student (Admin)' })
  @ApiCreatedResponse({ description: 'Student enrolled successfully.' })
  @ApiConflictResponse({
    description: 'Student is already ACTIVE or has a PENDING payment enrollment.',
  })
  @ApiBadRequestResponse({ description: 'Target user is not a student.' })
  @ApiNotFoundResponse({ description: 'Course or student not found.' })
  createManual(@Body() dto: CreateManualEnrollmentDto, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.createManual(dto, user);
  }

  /**
   * POST /enrollments/bulk
   *
   * Enrolls up to 100 students into a single course in one request.
   * Designed for batch operations like class registration at semester start.
   *
   * Never throws on partial failure — each student is processed independently.
   * Returns a full per-student report:
   *   { summary: { enrolled, reactivated, skipped, total }, results: [...] }
   *
   * Each result entry has status 'enrolled' | 'reactivated' | 'skipped'
   * and a reason string when skipped.
   *
   * Access: SUPER_ADMIN, ASSISTANT_ADMIN only.
   */
  @Post('enrollments/bulk')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_CREATE)
  @ApiOperation({ summary: 'Bulk enroll up to 100 students into a course (Admin)' })
  @ApiCreatedResponse({
    description: 'Bulk execution complete. See results for per-student outcome.',
  })
  @ApiBadRequestResponse({ description: 'Empty students list or exceeds 100 limit.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  bulkEnroll(@Body() dto: BulkEnrollDto, @GetCurrentUser() user: IUser) {
    return this.enrollmentService.bulkEnroll(dto, user);
  }

  /**
   * PATCH /enrollments/:id/cancel
   *
   * Soft-cancels an enrollment — transitions ACTIVE, COMPLETED, or EXPIRED to CANCELLED.
   * The row is never deleted; it is kept for audit trail and to preserve
   * the student's CourseProgress history.
   * Student loses course access immediately after cancellation.
   *
   * Emits 'enrollment.cancelled' so NotificationModule can notify the student.
   *
   * Blocked states:
   *   CANCELLED → 409 (already done)
   *   PENDING   → 400 (payment flow must resolve first)
   *
   * Access: SUPER_ADMIN, ASSISTANT_ADMIN only.
   */
  @Patch('enrollments/:id/cancel')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_DELETE)
  @ApiOperation({ summary: 'Soft-cancel an enrollment (Admin)' })
  @ApiOkResponse({ description: 'Enrollment cancelled successfully.' })
  @ApiConflictResponse({ description: 'Enrollment is already cancelled.' })
  @ApiBadRequestResponse({ description: 'Cannot cancel a PENDING enrollment.' })
  @ApiNotFoundResponse({ description: 'Enrollment not found.' })
  cancel(@Param('id') id: string, @GetCurrentUser('id') actorId: string) {
    return this.enrollmentService.cancel(id, actorId);
  }

  /**
   * PATCH /enrollments/:id/extend
   *
   * Updates the expiryDate on an enrollment to grant the student more access time.
   * If the enrollment was EXPIRED, it is automatically transitioned back to ACTIVE
   * and 'enrollment.reactivated' is emitted — existing CourseProgress is preserved.
   *
   * Body: { expiryDate: ISO 8601 string } — must be a future date.
   *
   * Blocked states:
   *   PENDING   → 400 (no expiry concept during payment flow)
   *   CANCELLED → 400 (re-enroll manually instead)
   *
   * Access: SUPER_ADMIN, ASSISTANT_ADMIN only.
   */
  @Patch('enrollments/:id/extend')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_UPDATE)
  @ApiOperation({
    summary: 'Extend enrollment expiry date — resurrects EXPIRED back to ACTIVE (Admin)',
  })
  @ApiOkResponse({ description: 'Expiry date updated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid state, or new date is not in the future.' })
  @ApiNotFoundResponse({ description: 'Enrollment not found.' })
  extend(
    @Param('id') id: string,
    @Body() dto: ExtendEnrollmentDto,
    @GetCurrentUser('id') actorId: string,
  ) {
    return this.enrollmentService.extendExpiry(id, dto, actorId);
  }

  /**
   * PATCH /enrollments/:id/transfer
   *
   * Transfers a student's ACTIVE enrollment from one course to another.
   * Designed for cases where a student enrolled in the wrong course.
   *
   * Source enrollment is cancelled and target enrollment is created (or
   * reactivated) inside a single DB transaction — either both succeed or
   * neither does. Source expiryDate is carried over to the target.
   *
   * Body: { targetCourseId: UUID, reason?: string }
   * @GetCurrentUser('id') passes the admin's ID to the service so enrolledBy
   * is set correctly on the target row for audit trail.
   *
   * Blocked states on source: anything other than ACTIVE → 409
   * Blocked states on target: ACTIVE or PENDING → 409
   *
   * Access: SUPER_ADMIN, ASSISTANT_ADMIN only.
   */
  @Patch('enrollments/:id/transfer')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ENROLLMENT_UPDATE)
  @ApiOperation({ summary: 'Transfer a student from one course to another (Admin)' })
  @ApiOkResponse({ description: 'Transfer completed successfully.' })
  @ApiConflictResponse({
    description: 'Source is not ACTIVE, or student already enrolled in target.',
  })
  @ApiBadRequestResponse({ description: 'Source and target course are the same.' })
  @ApiNotFoundResponse({ description: 'Enrollment or target course not found.' })
  transfer(
    @Param('id') id: string,
    @Body() dto: TransferEnrollmentDto,
    @GetCurrentUser('id') actorId: string,
  ) {
    return this.enrollmentService.transfer(id, dto, actorId);
  }
}
