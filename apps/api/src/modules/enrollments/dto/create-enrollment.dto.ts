import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 'student-uuid-here' })
  @IsUUID()
  studentUserId!: string;

  @ApiProperty({ example: 'course-uuid-here' })
  @IsUUID()
  courseId!: string;

  @ApiPropertyOptional({ example: 'parent-uuid-here' })
  @IsOptional()
  @IsUUID()
  enrolledBy?: string;

  @ApiProperty({ example: 199.00, description: 'Actual amount paid at enrollment' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amountPaid!: number;
}
