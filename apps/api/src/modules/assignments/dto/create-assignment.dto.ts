import { IsInt, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'lesson-uuid-here' })
  @IsUUID()
  lessonId!: string;

  @ApiProperty({ example: 60, description: 'Passing score percentage (0-100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  passingScorePct!: number;

  @ApiPropertyOptional({ example: 3, description: 'Maximum number of attempts allowed' })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;
}
