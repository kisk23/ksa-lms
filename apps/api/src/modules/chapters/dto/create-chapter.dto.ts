import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUUID, Min } from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({ example: 'course-uuid-here' })
  @IsUUID()
  courseId!: string;

  @ApiProperty({ example: 'المقدمة وتهيئة بيئة العمل' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  orderIndex!: number;
}
