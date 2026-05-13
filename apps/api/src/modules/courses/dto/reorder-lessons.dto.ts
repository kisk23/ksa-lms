// src/modules/courses/dto/reorder-lessons.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class ReorderLessonsDto {
  @ApiProperty({
    type: [String],
    description:
      'Complete ordered list of all active lesson IDs in the chapter (1-based position = array index + 1)',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  orderedIds!: string[];
}
