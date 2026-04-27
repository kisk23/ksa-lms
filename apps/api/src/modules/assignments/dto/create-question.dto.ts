import { IsString, IsInt, IsUUID, Min, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'assignment-uuid-here' })
  @IsUUID()
  assignmentId: string;

  @ApiProperty({ example: 'ما هي الدالة المستخدمة لطباعة نص في بايثون؟' })
  @IsString()
  text: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  orderIndex: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  shuffleOptions?: boolean = false;
}
