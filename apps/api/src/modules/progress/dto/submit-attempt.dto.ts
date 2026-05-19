import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsUUID } from 'class-validator';

export class AnswerDto {
  @ApiProperty({ description: 'Question ID' })
  @IsUUID()
  questionId!: string;

  @ApiProperty({ description: 'Selected option ID' })
  @IsUUID()
  selectedOptionId!: string;
}

export class SubmitAttemptDto {
  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];
}
