import { IsEnum, NotEquals } from 'class-validator';

import { ApprovalStatus } from '../../../generated/client';

export class ReviewApprovalDto {
  /**
   * New status assigned by the admin (cannot be PENDING_REVIEW)
   */
  @IsEnum(ApprovalStatus)
  @NotEquals(ApprovalStatus.PENDING_REVIEW, {
    message: 'Status cannot be set back to PENDING_REVIEW during review.',
  })
  status!: ApprovalStatus;
}
