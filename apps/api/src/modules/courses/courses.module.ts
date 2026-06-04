import { Module } from '@nestjs/common';

import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { ChaptersController } from './chapter.controller';
import { ChaptersService } from './chapter.service';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { AssignmentAccessGuard } from './guards/assignment-access.guard';
import { LessonAccessGuard } from './guards/lesson-access.guard';
import { LessonsController } from './lesson.controller';
import { LessonsService } from './lesson.service';

@Module({
  controllers: [CoursesController, ChaptersController, LessonsController, AssignmentsController],
  providers: [
    CoursesService,
    ChaptersService,
    LessonsService,
    AssignmentsService,
    LessonAccessGuard,
    AssignmentAccessGuard,
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
