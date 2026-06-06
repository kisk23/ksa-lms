import { UserRole } from '@lms/shared-types';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { EnrollmentsService } from './enrollments.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  @ApiOperation({ summary: 'Get weekly registration stats for the admin dashboard chart' })
  getRegistrationStats() {
    return this.enrollmentsService.getRegistrationStats();
  }
}
