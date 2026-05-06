import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min, Max, IsBoolean } from 'class-validator';

export class CreateAssignmentAttemptDto {
  @ApiProperty({ example: 'student-uuid-here' })
  @IsUUID()
  studentUserId!: string;

  @ApiProperty({ example: 'assignment-uuid-here' })
  @IsUUID()
  assignmentId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  attemptNumber!: number;

  @ApiProperty({ example: 85, description: 'Score achieved in this attempt' })
  @IsInt()
  @Min(0)
  @Max(100)
  scorePct!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPassed!: boolean;
}
