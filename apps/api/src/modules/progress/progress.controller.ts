import { UserRole, UserPermission } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AssignmentAttemptService } from './assignment-attempt.service';
import { CourseProgressService } from './course-progress.service';
import { UpdateWatchPctDto, SubmitAttemptDto, AdminProgressQueryDto } from './dto';
import { AssignmentAccessGuard } from './guards/assignment-access.guard';
import { EnrollmentGuard } from './guards/enrollment.guard';
import { StudentProgressAccessGuard } from './guards/student-progress-access.guard';
import { LessonProgressService } from './lesson-progress.service';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LessonAccessGuard } from '../courses/guards/lesson-access.guard';
import { Permissions } from '../users/decorators/permissions.decorator';
import { PermissionsGuard } from '../users/guards/permissions.guard';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ProgressController {
  constructor(
    private readonly lessonProgressService: LessonProgressService,
    private readonly courseProgressService: CourseProgressService,
    private readonly assignmentAttemptService: AssignmentAttemptService,
  ) {}

  // ─── LESSON PROGRESS ──────────────────────────────────────────────────────────

  /**
   * POST /progress/lessons/:id/watch
   *
   * LessonAccessGuard verifies the student is enrolled (or is the owning teacher/staff).
   * Enrollment membership check is inside LessonProgressService as a safety net too.
   */
  @Post('progress/lessons/:id/watch')
  @UseGuards(RolesGuard, LessonAccessGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Update video watch percentage for a lesson' })
  updateWatchPct(
    @Param('id') lessonId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: UpdateWatchPctDto,
  ) {
    return this.lessonProgressService.updateWatchPct(user.id, lessonId, dto.watchedPct);
  }

  /**
   * POST /progress/lessons/:id/complete
   *
   * Marks the lesson as completed and increments the course progress counter.
   * Idempotent — safe to call multiple times.
   */
  @Post('progress/lessons/:id/complete')
  @UseGuards(RolesGuard, LessonAccessGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Mark a lesson as completed' })
  completeLesson(@Param('id') lessonId: string, @GetCurrentUser() user: IUser) {
    return this.lessonProgressService.complete(user.id, lessonId);
  }

  // ─── COURSE PROGRESS ─────────────────────────────────────────────────────────

  /**
   * GET /progress/courses/:courseId
   *
   * EnrollmentGuard reads req.params.courseId and asserts ACTIVE enrollment
   * before the handler runs — no service-layer duplication needed here.
   */
  @Get('progress/courses/:courseId')
  @UseGuards(RolesGuard, EnrollmentGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get course progress summary for the current student' })
  getCourseProgress(@Param('courseId') courseId: string, @GetCurrentUser() user: IUser) {
    return this.courseProgressService.findByStudent(user.id, courseId);
  }

  /**
   * GET /progress/courses/:courseId/lessons
   *
   * EnrollmentGuard reads req.params.courseId and asserts ACTIVE enrollment.
   * Returns all lesson statuses including unstarted ones (progress: null).
   */
  @Get('progress/courses/:courseId/lessons')
  @UseGuards(RolesGuard, EnrollmentGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all lesson progress statuses in a course' })
  getLessonStatuses(@Param('courseId') courseId: string, @GetCurrentUser() user: IUser) {
    return this.lessonProgressService.findAllByCourse(user.id, courseId);
  }

  /**
   * GET /progress/courses/:courseId/students
   *
   * Dashboard endpoint for teachers and staff.
   * Retrieves all students' progress for a specific course.
   * EnrollmentGuard asserts course ownership for TEACHER and bypasses for staff.
   */
  @Get('progress/courses/:courseId/students')
  @UseGuards(RolesGuard, PermissionsGuard, EnrollmentGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.PROGRESS_READ)
  @ApiOperation({ summary: "Get all enrolled students' progress for a course (Teacher/Staff)" })
  getCourseStudentsProgress(@Param('courseId') courseId: string) {
    return this.courseProgressService.findStudentsProgressByCourse(courseId);
  }

  /**
   * GET /progress/admin/global
   *
   * System-wide global progress view for administrators and assistant admins.
   * Supports filtering by student, course, text search, and pagination.
   */
  @Get('progress/admin/global')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.PROGRESS_READ)
  @ApiOperation({
    summary: 'Get system-wide course progress reports with filtering (Admin/Assistant)',
  })
  getGlobalProgress(@Query() query: AdminProgressQueryDto) {
    return this.courseProgressService.findGlobalProgress(query);
  }

  // ─── ASSIGNMENT ATTEMPTS ─────────────────────────────────────────────────────

  /**
   * POST /assignments/:id/attempt
   *
   * Enrollment check lives inside AssignmentAttemptService.submit() — it
   * reuses the assignment→lesson→chapter→course join already loaded for grading
   * (zero extra queries). No guard duplication needed here.
   */
  @Post('assignments/:id/attempt')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit an assignment attempt' })
  submitAttempt(
    @Param('id') assignmentId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: SubmitAttemptDto,
  ) {
    return this.assignmentAttemptService.submit(user.id, assignmentId, dto.answers);
  }

  /**
   * GET /assignments/:id/attempts
   *
   * AssignmentAccessGuard verifies ACTIVE enrollment (students) or course
   * ownership (teachers/staff) before the handler runs.
   */
  @Get('assignments/:id/attempts')
  @UseGuards(RolesGuard, AssignmentAccessGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get own attempt history for an assignment' })
  getMyAttempts(@Param('id') assignmentId: string, @GetCurrentUser() user: IUser) {
    return this.assignmentAttemptService.findAttempts(user.id, assignmentId);
  }

  /**
   * GET /assignments/:id/best-score
   *
   * Self-service — student viewing their own score (no snapshot attached).
   * AssignmentAccessGuard verifies ACTIVE enrollment before returning data.
   */
  @Get('assignments/:id/best-score')
  @UseGuards(RolesGuard, AssignmentAccessGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get own best score for an assignment' })
  getBestScore(@Param('id') assignmentId: string, @GetCurrentUser() user: IUser) {
    return this.assignmentAttemptService.getSelfBestScore(user.id, assignmentId);
  }

  /**
   * GET /assignments/:id/attempts/all
   *
   * AssignmentAccessGuard verifies course ownership (TEACHER) or staff role.
   * No EnrollmentGuard — teachers own the course, they are not enrolled in it.
   */
  @Get('assignments/:id/attempts/all')
  @UseGuards(RolesGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.ASSIGNMENT_READ)
  @ApiOperation({ summary: "Get all students' attempts for an assignment (Teacher)" })
  getAllAttempts(@Param('id') assignmentId: string) {
    return this.assignmentAttemptService.findAllAttempts(assignmentId);
  }

  // ─── CROSS-USER MONITORING & ACCESS ──────────────────────────────────────────

  /**
   * GET /students/:studentId/progress/courses
   *
   * Exposes a student's entire course progress list (for dashboard).
   * StudentProgressAccessGuard allows:
   *   - The student themselves
   *   - A parent with a verified ParentStudentLink to that student
   *   - A teacher who owns at least one course the student is enrolled in
   *     (the service layer automatically filters records to only show their course)
   *   - Staff (SUPER_ADMIN, ASSISTANT_ADMIN)
   */
  @Get('students/:studentId/progress/courses')
  @UseGuards(PermissionsGuard, StudentProgressAccessGuard)
  @Permissions(UserPermission.PROGRESS_READ)
  @ApiOperation({
    summary: 'Get all course progress summaries for a student (student, parent, teacher, staff)',
  })
  getStudentAllProgress(@Param('studentId') studentId: string, @GetCurrentUser() user: IUser) {
    return this.courseProgressService.findAllForStudent(user, studentId);
  }

  /**
   * GET /students/:studentId/progress/courses/:courseId
   *
   * Cross-user course progress summary view.
   * StudentProgressAccessGuard allows:
   *   - The student themselves
   *   - A parent with a verified ParentStudentLink to that student
   *   - The teacher who owns the course (only for their own course)
   *   - Staff (SUPER_ADMIN, ASSISTANT_ADMIN)
   */
  @Get('students/:studentId/progress/courses/:courseId')
  @UseGuards(PermissionsGuard, StudentProgressAccessGuard)
  @Permissions(UserPermission.PROGRESS_READ)
  @ApiOperation({
    summary: "Get a student's course progress summary (student, parent, course teacher, staff)",
  })
  getStudentCourseProgress(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.courseProgressService.findByStudent(studentId, courseId);
  }

  /**
   * GET /students/:studentId/progress/courses/:courseId/lessons
   *
   * Cross-user lesson progress list view.
   * StudentProgressAccessGuard allows:
   *   - The student themselves
   *   - A parent with a verified ParentStudentLink to that student
   *   - The teacher who owns the course (only for their own course)
   *   - Staff (SUPER_ADMIN, ASSISTANT_ADMIN)
   */
  @Get('students/:studentId/progress/courses/:courseId/lessons')
  @UseGuards(PermissionsGuard, StudentProgressAccessGuard)
  @Permissions(UserPermission.PROGRESS_READ)
  @ApiOperation({
    summary:
      'Get all lesson progress statuses for a student in a course (student, parent, course teacher, staff)',
  })
  getStudentLessonStatuses(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.lessonProgressService.findAllByCourse(studentId, courseId);
  }

  // ─── CROSS-USER WRITE OVERRIDES (TEACHER & STAFF) ────────────────────────────

  /**
   * POST /students/:studentId/progress/lessons/:lessonId/complete
   *
   * Allows the course owner teacher, assistant, or staff to manually mark a lesson
   * completed on behalf of a student.
   *
   * StudentProgressAccessGuard verifies the teacher is the owner of the course.
   * PermissionsGuard checks assistant permission 'UPDATE_PROGRESS'.
   */
  @Post('students/:studentId/progress/lessons/:lessonId/complete')
  @UseGuards(RolesGuard, PermissionsGuard, StudentProgressAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.PROGRESS_UPDATE)
  @ApiOperation({
    summary: 'Manually mark a lesson as completed for a student (teacher, assistant, staff)',
  })
  completeLessonForStudent(
    @Param('studentId') studentId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonProgressService.complete(studentId, lessonId);
  }

  /**
   * POST /students/:studentId/progress/lessons/:lessonId/watch
   *
   * Allows the course owner teacher, assistant, or staff to manually update a
   * student's video watch percentage for a lesson.
   *
   * StudentProgressAccessGuard verifies the teacher is the owner of the course.
   * PermissionsGuard checks assistant permission 'UPDATE_PROGRESS'.
   */
  @Post('students/:studentId/progress/lessons/:lessonId/watch')
  @UseGuards(RolesGuard, PermissionsGuard, StudentProgressAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions(UserPermission.PROGRESS_UPDATE)
  @ApiOperation({
    summary: "Manually update a student's video watch percentage (teacher, assistant, staff)",
  })
  updateWatchPctForStudent(
    @Param('studentId') studentId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateWatchPctDto,
  ) {
    return this.lessonProgressService.updateWatchPct(studentId, lessonId, dto.watchedPct);
  }

  /**
   * GET /students/:studentId/assignments/:assignmentId/best-score
   *
   * Different access model from the self-service routes above — the target
   * student is named explicitly in the URL, so the guard must answer
   * "can THIS actor view THAT student's score?" rather than just "is this
   * actor enrolled?".
   *
   * StudentProgressAccessGuard allows:
   *   - The student themselves
   *   - A parent with a verified ParentStudentLink to that student
   *   - The teacher who owns the course the assignment belongs to (only for their own course)
   *   - Staff (SUPER_ADMIN, ASSISTANT_ADMIN)
   *
   * Moved here from CoursesModule — score access is a ProgressModule concern.
   */
  @Get('students/:studentId/assignments/:assignmentId/best-score')
  @UseGuards(PermissionsGuard, StudentProgressAccessGuard)
  @Permissions(UserPermission.PROGRESS_READ)
  @ApiOperation({
    summary:
      'Get best score for a student on an assignment (student, their parent, course teacher, staff)',
  })
  getStudentBestScore(
    @Param('studentId') studentId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.assignmentAttemptService.getBestScore(studentId, assignmentId);
  }
}
