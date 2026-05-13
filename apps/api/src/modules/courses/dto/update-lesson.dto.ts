// src/modules/courses/dto/update-lesson.dto.ts
import { PartialType } from '@nestjs/swagger';

import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
