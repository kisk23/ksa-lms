import { Module } from '@nestjs/common';

import { LessonAccessGuard } from '../courses/guards/lesson-access.guard';
import { LessonsService } from '../courses/lesson.service';

@Module({
  providers: [LessonsService, LessonAccessGuard],
  exports: [LessonsService, LessonAccessGuard],
})
export class LessonsModule {}
