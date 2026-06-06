import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, Length } from 'class-validator';

export class TransferEnrollmentDto {
  @ApiProperty({ description: 'UUID of the target course' })
  @IsUUID()
  targetCourseId!: string;

  @ApiPropertyOptional({
    description: 'Optional transfer reason for auditing.',
    example: 'Student enrolled in wrong course',
  })
  @IsOptional()
  @IsString()
  @Length(10, 300)
  reason?: string;
}
