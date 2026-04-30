import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'احمد الحربي' })
  @IsUUID()
  teacherUserId!: string;

  @ApiProperty({ example: 'أساسيات البرمجة بلغة بايثون' })
  @IsString()
  @MinLength(5)
  title!: string;

  @ApiPropertyOptional({ example: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiProperty({ example: 199.0, description: 'Price in SAR' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;
}
