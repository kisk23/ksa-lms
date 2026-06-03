import { EnrollmentStatus } from '@lms/shared-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsEnum, IsString, IsInt, Min } from 'class-validator';

export class AdminEnrollmentQueryDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by course ID' })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({ enum: EnrollmentStatus, description: 'Filter by enrollment status' })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiPropertyOptional({ description: 'Search query for student name/email and course title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Records per page', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
