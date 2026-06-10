import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min, IsUUID, IsDateString } from 'class-validator';

import { ApprovalStatus } from '../../../generated/client';

export class ListApprovalsDto {
  /**
   * Filter approval requests by their status
   */
  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus;

  /**
   * Page number for pagination
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  /**
   * Items per page for pagination
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsUUID()
  requestedBy?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
