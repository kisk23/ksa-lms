// src/modules/courses/dto/create-lesson.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl, MaxLength } from 'class-validator';

import { VideoProvider } from '../../../generated/client';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to Variables' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=abc123' })
  @IsOptional()
  @IsUrl({}, { message: 'videoUrl must be a valid URL' })
  videoUrl?: string;

  @ApiPropertyOptional({ enum: VideoProvider, default: VideoProvider.YOUTUBE })
  @IsOptional()
  @IsEnum(VideoProvider)
  videoProvider?: VideoProvider;
}
