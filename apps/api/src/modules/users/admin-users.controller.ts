import { UserRole } from '@lms/shared-types';
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

import { Permissions } from './decorators/permissions.decorator';
import {
  CreateUserDto,
  UpdateUserDto,
  AssistantPermissionsDto,
  AdminLinkChildDto,

  AdminUsersQueryDto,

  ListUsersQueryDto

} from './dto';
import { PermissionsGuard } from './guards/permissions.guard';
import { UsersService } from './users.service';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Admin / User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('admin')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('CREATE_USER')
  @ApiOperation({ summary: 'Create Teacher or Assistant account' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('users')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('VIEW_USERS')
  @ApiOperation({ summary: 'List all users' })

  findAll(@Query() query: ListUsersQueryDto) {

    return this.usersService.findAll({
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 10),
      search: query.search,
      role: query.role,
      status: query.status,
    });
  }

  @Get('users/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('VIEW_USERS')
  @ApiOperation({ summary: 'Get details of a specific user' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('users/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Update any user account' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @Permissions('DELETE_USER')
  @ApiOperation({ summary: 'Soft-deactivate user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('assistant-permissions')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Set Assistant permissions' })
  setPermissions(@GetCurrentUser('id') granterId: string, @Body() dto: AssistantPermissionsDto) {
    return this.usersService.setAssistantPermissions(
      granterId,
      dto.assistant_user_id,
      dto.permissions,
    );
  }

  @Post('link-parent-student')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Link any student to any parent' })
  linkParentStudent(@Body() dto: AdminLinkChildDto) {
    return this.usersService.linkChild(dto.parent_id, dto.student_id, dto.relationship);
  }

  @Delete('unlink-parent-student')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Unlink any student from any parent' })
  unlinkParentStudent(@Query('parentId') parentId: string, @Query('studentId') studentId: string) {
    return this.usersService.unlinkChild(parentId, studentId);
  }

  @Get('dashboard/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('VIEW_USERS')
  @ApiOperation({ summary: 'Get overview stats for admin dashboard' })
  getDashboardStats() {
    return this.usersService.getDashboardStats();
  }

  // --- Teacher Management ---

  @Patch('teachers/:id/lock')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Lock a teacher account (prevent edits but allow login)' })
  lockTeacher(@Param('id') id: string, @Body() dto: { reason?: string }) {
    return this.usersService.lockTeacher(id, dto.reason);
  }

  @Patch('teachers/:id/unlock')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Unlock a teacher account' })
  unlockTeacher(@Param('id') id: string) {
    return this.usersService.unlockTeacher(id);
  }

  @Patch('teachers/:id/ban')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Ban a teacher account (prevent login)' })
  banTeacher(@Param('id') id: string, @Body() dto: { reason?: string; expiresAt?: string }) {
    return this.usersService.banTeacher(
      id,
      dto.reason,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }

  @Patch('teachers/:id/unban')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @Permissions('UPDATE_USER')
  @ApiOperation({ summary: 'Unban a teacher account' })
  unbanTeacher(@Param('id') id: string) {
    return this.usersService.unbanTeacher(id);
  }
}
