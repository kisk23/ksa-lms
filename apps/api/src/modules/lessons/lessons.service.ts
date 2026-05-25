import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get assignment for a lesson
   * A lesson has at most one assignment
   */
  async getAssignment(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        assignment: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${lessonId} not found`);
    }

    if (!lesson.assignment) {
      throw new NotFoundException(`No assignment found for lesson #${lessonId}`);
    }

    return lesson.assignment;
  }

  /**
   * Get files for a lesson
   * LessonFile is not yet in the Prisma schema, return empty array for now
   */
  async getFiles(_lessonId: string) {
    // TODO: Implement when LessonFile is added to schema
    return [];
  }
}
