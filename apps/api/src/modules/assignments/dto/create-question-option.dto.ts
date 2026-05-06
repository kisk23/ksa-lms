import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUUID, Min, IsBoolean } from 'class-validator';

export class CreateQuestionOptionDto {
  @ApiProperty({ example: 'question-uuid-here' })
  @IsUUID()
  questionId!: string;

  @ApiProperty({ example: 'print()' })
  @IsString()
  text!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  orderIndex!: number;
}
