import { IsString, MinLength, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to TypeScript' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Learn TypeScript from scratch...' })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ example: 2999, description: 'Price in cents' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ enum: DifficultyLevel, default: DifficultyLevel.BEGINNER })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel = DifficultyLevel.BEGINNER;

  @ApiProperty({ description: 'Category ID' })
  @IsString()
  categoryId: string;
}
