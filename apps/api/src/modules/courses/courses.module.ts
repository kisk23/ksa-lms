import { Module } from '@nestjs/common';

import { ChaptersController } from './chapter.controller';
import { ChaptersService } from './chapter.service';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { LessonAccessGuard } from './guards/lesson-access.guard';
import { LessonsController } from './lesson.controller';
import { LessonsService } from './lesson.service';

@Module({
  controllers: [CoursesController, ChaptersController, LessonsController],
  providers: [CoursesService, ChaptersService, LessonsService, LessonAccessGuard],
  exports: [CoursesService],
})
export class CoursesModule {}
