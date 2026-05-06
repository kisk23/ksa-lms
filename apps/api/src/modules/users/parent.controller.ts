import { UserRole } from '@lms/shared-types';
import { Controller, Get, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { LinkChildDto } from './dto';
import { UsersService } from './users.service';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Parent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parent')
export class ParentController {
  constructor(private readonly usersService: UsersService) {}

  @Post('link-child')
  @Roles(UserRole.PARENT)
  @ApiOperation({ summary: 'Link child by student ID' })
  linkChild(@GetCurrentUser('id') parentId: string, @Body() dto: LinkChildDto) {
    return this.usersService.linkChild(parentId, dto.student_id, dto.relationship);
  }

  @Get('children')
  @Roles(UserRole.PARENT)
  @ApiOperation({ summary: 'List all linked children' })
  listChildren(@GetCurrentUser('id') parentId: string) {
    return this.usersService.listChildren(parentId);
  }

  @Delete('unlink-child/:studentId')
  @Roles(UserRole.PARENT)
  @ApiOperation({ summary: 'Unlink a child' })
  unlinkChild(@GetCurrentUser('id') parentId: string, @Param('studentId') studentId: string) {
    return this.usersService.unlinkChild(parentId, studentId);
  }
}
