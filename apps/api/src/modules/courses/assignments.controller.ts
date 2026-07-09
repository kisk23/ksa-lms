import { UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AssignmentsService } from './assignments.service';
import { CourseContext } from './decorators/course-context.decorator';
import type { ICourseContext } from './decorators/course-context.decorator';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from './dto';
import { AssignmentAccessGuard } from './guards/assignment-access.guard';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TeacherStatusGuard } from '../auth/guards/teacher-status.guard';
import { Permissions } from '../users/decorators/permissions.decorator';
import { PermissionsGuard } from '../users/guards/permissions.guard';

@ApiTags('Assignments')
@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('lessons/:lessonId/assignment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AssignmentAccessGuard)
  @ApiOperation({
    summary: 'Get assignment for a lesson (enrolled students, owner teacher, staff)',
  })
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.assignmentsService.findByLesson(lessonId);
  }

  @Post('lessons/:lessonId/assignment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('CREATE_ASSIGNMENT')
  @ApiOperation({ summary: 'Create an assignment for a lesson' })
  create(
    @Param('lessonId') lessonId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: CreateAssignmentDto,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.create(lessonId, user, dto, context);
  }

  @Patch('assignments/:assignmentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_ASSIGNMENT')
  @ApiOperation({ summary: 'Update assignment settings' })
  update(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: UpdateAssignmentDto,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.update(assignmentId, user, dto, context);
  }

  @Delete('assignments/:assignmentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('DELETE_ASSIGNMENT')
  @ApiOperation({ summary: 'Soft-archive an assignment' })
  archive(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUser() user: IUser,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.archive(assignmentId, user, context);
  }

  @Post('assignments/:assignmentId/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('RESTORE_ASSIGNMENT')
  @ApiOperation({ summary: 'Restore an archived assignment' })
  restore(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUser() user: IUser,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.restore(assignmentId, user, context);
  }

  @Post('assignments/:assignmentId/questions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_ASSIGNMENT')
  @ApiOperation({ summary: 'Add a question to an assignment' })
  addQuestion(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: CreateQuestionDto,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.addQuestion(assignmentId, user, dto, context);
  }

  @Patch('questions/:questionId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_ASSIGNMENT')
  @ApiOperation({ summary: 'Update a question and its options' })
  updateQuestion(
    @Param('questionId') questionId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: UpdateQuestionDto,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.updateQuestion(questionId, user, dto, context);
  }

  @Delete('questions/:questionId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard, AssignmentAccessGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_ASSIGNMENT')
  @ApiOperation({ summary: 'Delete a question' })
  deleteQuestion(
    @Param('questionId') questionId: string,
    @GetCurrentUser() user: IUser,
    @CourseContext() context: ICourseContext,
  ) {
    return this.assignmentsService.deleteQuestion(questionId, user, context);
  }
}
