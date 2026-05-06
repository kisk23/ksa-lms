import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsUUID, Min, Max, IsOptional, IsDateString } from 'class-validator';

export class UpdateLessonProgressDto {
  @ApiProperty({ example: 'student-uuid-here' })
  @IsUUID()
  studentUserId!: string;

  @ApiProperty({ example: 'lesson-uuid-here' })
  @IsUUID()
  lessonId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  lessonVersion!: number;

  @ApiProperty({ example: 45, description: 'Percentage of video watched (0-100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  videoWatchedPct!: number;

  @ApiPropertyOptional({ example: '2026-04-27T20:00:00Z' })
  @IsOptional()
  @IsDateString()
  videoCompletedAt?: string;
}
