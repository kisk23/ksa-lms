import { UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ChaptersService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto, ReorderChaptersDto } from './dto';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TeacherStatusGuard } from '../auth/guards/teacher-status.guard';
import { Permissions } from '../users/decorators/permissions.decorator';
import { PermissionsGuard } from '../users/guards/permissions.guard';
// import { EnrollmentGuard } from './guards/enrollment.guard';

@ApiTags('Chapters')
@Controller()
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  // ─── READ ────────────────────────────────────────────────────────────────────

  // @Get('courses/:courseId/chapters')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, EnrollmentGuard)
  // @ApiOperation({ summary: 'List chapters with lessons (Enrolled student or Teacher)' })
  // findByCourse(
  //   @Param('courseId') courseId: string,
  //   @GetCurrentUser() user: IUser,
  // ) {
  //   return this.chaptersService.findByCourse(courseId, user);
  // }

  // ─── CREATE ──────────────────────────────────────────────────────────────────

  @Post('courses/:courseId/chapters')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('CREATE_CHAPTER')
  @ApiOperation({ summary: 'Create a chapter in a course' })
  create(
    @Param('courseId') courseId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: CreateChapterDto,
  ) {
    return this.chaptersService.create(courseId, user, dto);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  @Patch('chapters/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_CHAPTER')
  @ApiOperation({ summary: 'Update chapter title or order' })
  update(@Param('id') id: string, @GetCurrentUser() user: IUser, @Body() dto: UpdateChapterDto) {
    return this.chaptersService.update(id, user, dto);
  }

  // ─── REORDER ─────────────────────────────────────────────────────────────────

  @Patch('courses/:courseId/chapters/reorder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_CHAPTER')
  @ApiOperation({ summary: 'Bulk reorder chapters within a course' })
  reorder(
    @Param('courseId') courseId: string,
    @GetCurrentUser() user: IUser,
    @Body() dto: ReorderChaptersDto,
  ) {
    return this.chaptersService.reorder(courseId, user, dto.orderedIds);
  }

  // ─── SOFT DELETE ─────────────────────────────────────────────────────────────

  @Delete('chapters/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, TeacherStatusGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('DELETE_CHAPTER')
  @ApiOperation({ summary: 'Soft-delete a chapter (cascades to lessons)' })
  softDelete(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    return this.chaptersService.softDelete(id, user);
  }
}
