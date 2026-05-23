import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateManualEnrollmentDto {
  @ApiProperty({ description: 'UUID of the student to enroll' })
  @IsUUID()
  studentUserId!: string;

  @ApiProperty({ description: 'UUID of the course to enroll the student into' })
  @IsUUID()
  courseId!: string;

  @ApiPropertyOptional({
    description: 'Amount paid (SAR). Defaults to 0 for fully-offline or free enrollments.',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @ApiPropertyOptional({
    description: 'Optional expiry date for the enrollment (ISO 8601). Null means no expiry.',
    example: '2026-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
