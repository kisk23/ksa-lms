import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import { PaymentStatus } from '../../../generated/client';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;

  @IsOptional()
  @IsString()
  description?: string;
}
