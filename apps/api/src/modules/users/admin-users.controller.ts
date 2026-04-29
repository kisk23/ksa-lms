import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AssistantPermissionsDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { Permissions } from './decorators/permissions.decorator';
import { UserRole } from '@lms/shared-types';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';

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
  findAll(@Query() query: PaginationQueryDto & { role?: UserRole }) {
    return this.usersService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      role: query.role,
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
    return this.usersService.setAssistantPermissions(granterId, dto.assistant_user_id, dto.permissions);
  }
}
