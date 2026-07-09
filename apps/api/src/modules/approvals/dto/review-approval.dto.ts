import { IsEnum, NotEquals, IsString, MinLength, ValidateIf } from 'class-validator';

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

  /**
   * Required reason if status is REJECTED or CHANGES_REQUESTED
   */
  @ValidateIf(
    (o) => o.status === ApprovalStatus.REJECTED || o.status === ApprovalStatus.CHANGES_REQUESTED,
  )
  @IsString()
  @MinLength(10, { message: 'سبب الرفض يجب أن يكون 10 أحرف على الأقل.' })
  rejectionReason?: string;
}
