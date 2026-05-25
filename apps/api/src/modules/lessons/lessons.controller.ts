import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonAccessGuard } from '../courses/guards/lesson-access.guard';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':lessonId/assignment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, LessonAccessGuard)
  @ApiOperation({ summary: 'Get assignment for a lesson' })
  getAssignment(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getAssignment(lessonId);
  }

  @Get(':lessonId/files')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, LessonAccessGuard)
  @ApiOperation({ summary: 'Get files for a lesson' })
  getFiles(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getFiles(lessonId);
  }
}
