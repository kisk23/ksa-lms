import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { RequestType } from '../../../generated/client';

export class CreateApprovalDto {
  /**
   * Type of approval request
   */
  @IsEnum(RequestType)
  requestType!: RequestType;

  /**
   * The course associated with the approval request
   */
  @IsUUID()
  courseId!: string;

  /**
   * The specific lesson associated with the approval request, if any
   */
  @IsOptional()
  @IsUUID()
  lessonId?: string;
}
