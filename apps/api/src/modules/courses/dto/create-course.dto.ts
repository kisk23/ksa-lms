import { VideoProvider } from '@lms/shared-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
  Min,
  IsUUID,
  IsUrl,
  IsEnum,
  MaxLength,
} from 'class-validator';

export class CreateCourseDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Teacher User ID. If omitted, the logged in user will be used.',
  })
  @IsOptional()
  @IsUUID()
  teacherUserId?: string;

  @ApiProperty({ example: 'أساسيات البرمجة بلغة بايثون' })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ example: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' })
  @IsOptional()
  @IsUrl()
  promoVideoUrl?: string;

  @ApiPropertyOptional({ enum: VideoProvider })
  @IsOptional()
  @IsEnum(VideoProvider)
  promoVideoProvider?: VideoProvider;

  @ApiProperty({ example: 199.0, description: 'Price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @ApiPropertyOptional({ example: 'SAR', description: 'Currency code (default: SAR)' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}
