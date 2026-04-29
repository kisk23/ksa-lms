import { IsString, IsInt, IsUUID, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'chapter-uuid-here' })
  @IsUUID()
  chapterId!: string;

  @ApiProperty({ example: 'مرحبا بالعالم — أول برنامج' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  orderIndex!: number;

  @ApiProperty({ example: 'dQw4w9WgXcQ', description: 'YouTube Video ID' })
  @IsString()
  @MaxLength(20)
  youtubeVideoId!: string;
}
