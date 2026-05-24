import { UserRole, CourseStatus } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Permissions } from '../users/decorators/permissions.decorator';
import { PermissionsGuard } from '../users/guards/permissions.guard';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List all published courses (Public)' })
  findAll(@Query() query: PaginationQueryDto & { teacherUserId?: string }) {
    return this.coursesService.findAll({
      page: Number(query.page) ?? 1,
      limit: Number(query.limit) ?? 10,
      search: query.search,
      status: CourseStatus.PUBLISHED, // Security: Public can only see published
      teacherUserId: query.teacherUserId,
    });
  }

  @Get('manage')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('VIEW_COURSES')
  @ApiOperation({ summary: 'List courses for management (Dashboard)' })
  findForManagement(
    @GetCurrentUser() user: IUser,
    @Query() query: PaginationQueryDto & { status?: CourseStatus; teacherUserId?: string },
  ) {
    // Logic: Teachers can ONLY see their own courses.
    // Admins/Assistants can see all or filter by a specific teacher.
    const teacherUserId = user.role === UserRole.TEACHER ? user.id : query.teacherUserId;

    return this.coursesService.findAll({
      page: Number(query.page) ?? 1,
      limit: Number(query.limit) ?? 10,
      search: query.search,
      status: query.status,
      teacherUserId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course details' })
  findOne(@Param('id') id: string, @GetCurrentUser() user?: IUser) {
    return this.coursesService.findById(id, user);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('CREATE_COURSE')
  @ApiOperation({ summary: 'Create a course' })
  create(@GetCurrentUser() user: IUser, @Body() dto: CreateCourseDto) {
    return this.coursesService.create(user, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_COURSE')
  @ApiOperation({ summary: 'Update course metadata' })
  update(@Param('id') id: string, @GetCurrentUser() user: IUser, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, user, dto);
  }

  @Patch(':id/publish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('PUBLISH_COURSE')
  @ApiOperation({ summary: 'Publish a draft course' })
  publish(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    return this.coursesService.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('ARCHIVE_COURSE')
  @ApiOperation({ summary: 'Soft-archive a course' })
  archive(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    return this.coursesService.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('RESTORE_COURSE')
  @ApiOperation({ summary: 'Restore an archived course' })
  restore(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    return this.coursesService.restore(id, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('DELETE_COURSE')
  @ApiOperation({ summary: 'Hard delete a course (only if no enrollments)' })
  remove(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    return this.coursesService.remove(id, user);
  }
}
