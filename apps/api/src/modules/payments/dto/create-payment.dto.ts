import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { PaymentSourceDto } from './payment-source.dto';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  orderId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(100)
  amount!: number;

  @IsString()
  @MaxLength(3)
  currency: string = 'SAR';

  @IsUUID()
  studentUserId!: string;

  @IsUUID()
  courseId!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  callbackUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentSourceDto)
  source?: PaymentSourceDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
