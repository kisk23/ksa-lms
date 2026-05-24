import { Module } from '@nestjs/common';

import { AssignmentAttemptService } from './assignment-attempt.service';
import { CourseProgressService } from './course-progress.service';
import { LessonProgressService } from './lesson-progress.service';
import { ProgressController } from './progress.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesModule } from '../courses/courses.module'; // for LessonAccessGuard

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [ProgressController],
  providers: [LessonProgressService, CourseProgressService, AssignmentAttemptService],
  exports: [
    // DashboardModule imports these directly
    LessonProgressService,
    CourseProgressService,
  ],
})
export class ProgressModule {}
