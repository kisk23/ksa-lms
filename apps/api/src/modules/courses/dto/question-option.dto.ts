import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class QuestionOptionDto {
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
