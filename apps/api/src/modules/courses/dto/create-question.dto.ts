import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, Min, IsArray, ValidateNested } from 'class-validator';

import { QuestionOptionDto } from './question-option.dto';

export class CreateQuestionDto {
  @ApiProperty({ example: 'ما هي الدالة المستخدمة لطباعة نص في بايثون؟' })
  @IsString()
  text!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  orderIndex!: number;

  @ApiProperty({ type: [QuestionOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options!: QuestionOptionDto[];
}
