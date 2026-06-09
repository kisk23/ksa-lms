import { UserRole } from '@lms/shared-types';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ListApprovalsDto } from './dto/list-approvals.dto';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  /**
   * Endpoint for teachers to create a new approval request.
   * @param req The authenticated request containing the user info
   * @param dto The creation payload
   * @returns The created approval request
   */
  @Post()
  @Roles(UserRole.TEACHER)
  async createApproval(@Request() req: { user: { id: string } }, @Body() dto: CreateApprovalDto) {
    return this.approvalsService.createApproval(req.user.id, dto);
  }

  /**
   * Endpoint for admins to list all approval requests.
   * @param query Filtering and pagination query params
   * @returns Paginated list of approval requests
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  async listApprovals(@Query() query: ListApprovalsDto) {
    return this.approvalsService.listApprovals(query);
  }

  /**
   * Endpoint for admins to fetch detailed information for a single approval request.
   * @param id The UUID of the request
   * @returns Detailed approval request including related course and lessons
   */
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  async getApprovalDetail(@Param('id') id: string) {
    return this.approvalsService.getApprovalDetail(id);
  }

  /**
   * Endpoint for admins to review (approve/reject/request changes) an approval request.
   * @param id The UUID of the request to review
   * @param req The authenticated request containing the admin's info
   * @param dto The review payload
   * @returns The updated approval request
   */
  @Patch(':id/review')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ASSISTANT_ADMIN)
  async reviewApproval(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() dto: ReviewApprovalDto,
  ) {
    return this.approvalsService.reviewApproval(id, req.user.id, dto);
  }
}
