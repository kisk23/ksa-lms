import { Module } from '@nestjs/common';

import { CoursesController } from './courses.controller';
// import { ChaptersController } from './chapter.controller';
import { CoursesService } from './courses.service';
// import { ChaptersService } from './chapters.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
