import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateAssignmentDto {
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
