import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { LessonAccessGuard } from '../courses/guards/lesson-access.guard';
import { LessonsService } from '../courses/lesson.service';

@Module({
  imports: [CoursesModule],
  providers: [LessonsService, LessonAccessGuard],
  exports: [LessonsService, LessonAccessGuard],
})
export class LessonsModule {}
