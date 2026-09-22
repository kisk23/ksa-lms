import { UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CreateLessonDto, UpdateLessonDto, ReorderLessonsDto } from './dto';
import { LessonAccessGuard } from './guards/lesson-access.guard';
import { LessonsService } from './lesson.service';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TeacherStatusGuard } from '../auth/guards/teacher-status.guard';
import { Permissions } from '../users/decorators/permissions.decorator';
import { PermissionsGuard } from '../users/guards/permissions.guard';

@ApiTags('Lessons')
@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // ─── READ ────────────────────────────────────────────────────────────────────

  /**
   * LessonAccessGuard resolves courseId from the lesson's chapter join and
   * verifies enrollment (students) or ownership (teachers). No RolesGuard needed
   * here because the LessonAccessGuard is the role+content gate for this route.
   */
  @Get('lessons/:lessonId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, LessonAccessGuard)
  @ApiOperation({
    summary: 'Get lesson with video details (enrolled students, owner teacher, staff)',
  })
  findOne(@Param('lessonId') lessonId: string) {
    return this.lessonsService.findOne(lessonId);
  }

  @Get('lessons/:lessonId/files')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, LessonAccessGuard)
  @ApiOperation({
    summary: 'Get downloadable files for a lesson (enrolled students, owner teacher, staff)',
  })
  getFiles(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getFiles(lessonId);
  }

  // ─── CREATE ──────────────────────────────────────────────────────────────────

  @Post('chapters/:chapterId/lessons')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('CREATE_LESSON')
  @ApiOperation({ summary: 'Create a lesson in a chapter' })
  create(
    @Param('chapterId') chapterId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.create(chapterId, user, dto);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  @Patch('lessons/:lessonId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_LESSON')
  @ApiOperation({ summary: 'Update lesson title or video (bumps version on content change)' })
  update(
    @Param('lessonId') lessonId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(lessonId, user, dto);
  }

  // ─── REORDER ─────────────────────────────────────────────────────────────────

  @Patch('chapters/:chapterId/lessons/reorder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_LESSON')
  @ApiOperation({ summary: 'Bulk reorder lessons within a chapter' })
  reorder(
    @Param('chapterId') chapterId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: ReorderLessonsDto,
  ) {
    return this.lessonsService.reorder(chapterId, user, dto.orderedIds);
  }

  // ─── SOFT DELETE ─────────────────────────────────────────────────────────────

  @Delete('lessons/:lessonId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('DELETE_LESSON')
  @ApiOperation({ summary: 'Soft-archive a lesson' })
  softDelete(@Param('lessonId') lessonId: string, @GetCurrentUser() user: IUser) {
    return this.lessonsService.softDelete(lessonId, user);
  }
}
