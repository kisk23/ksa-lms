import { IUser } from '@lms/shared-types';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CoursesService } from './courses.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /**
   * Fetch for write operations — joins to chapter→course so ownership can be
   * validated before any mutation is applied.
   */
  private async verifyExistsWithCourse(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        chapterId: true,
        orderIndex: true,
        archivedAt: true,
        chapter: {
          select: {
            courseId: true,
            course: { select: { teacherUserId: true } },
          },
        },
      },
    });

    if (!lesson || lesson.archivedAt) {
      throw new NotFoundException(`Lesson #${id} not found or archived`);
    }
    return lesson;
  }

  /**
   * Resolves the next available orderIndex for a new lesson within a chapter.
   * Uses MAX(orderIndex) + 1 so gaps from soft-deletes never cause conflicts.
   */
  private async getNextOrderIndex(chapterId: string): Promise<number> {
    const last = await this.prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    return (last?.orderIndex ?? 0) + 1;
  }

  // ─── PUBLIC METHODS ───────────────────────────────────────────────────────────

  /**
   * 1 — findOne(id)
   * Returns full lesson details including video URL.
   * Authorization is enforced upstream by LessonAccessGuard.
   */
  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        assignment: {
          select: { id: true, passingScorePct: true, maxAttempts: true },
        },
      },
    });

    if (!lesson || lesson.archivedAt) {
      throw new NotFoundException(`Lesson #${id} not found or archived`);
    }

    return lesson;
  }

  /**
   * 1b — getFiles(lessonId)
   * Returns downloadable files attached to a lesson.
   * LessonFile model is not yet in the Prisma schema — returns an empty array
   * until the model is added and this method is implemented.
   * TODO: implement when LessonFile is added to the schema.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFiles(_lessonId: string): Promise<[]> {
    return [];
  }

  /**
   * 2 — create(chapterId, actor, dto)
   * Appends a new lesson to a chapter.
   * Validates ownership of the parent course before creating.
   * Emits 'lesson.created' for ProgressModule (lesson count tracking).
   */
  async create(chapterId: string, actor: IUser, dto: CreateLessonDto) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        archivedAt: true,
        courseId: true,
        course: { select: { teacherUserId: true } },
      },
    });

    if (!chapter || chapter.archivedAt) {
      throw new NotFoundException(`Chapter #${chapterId} not found or archived`);
    }

    this.coursesService.validateOwnership(chapter.course, actor);

    const orderIndex = await this.getNextOrderIndex(chapterId);

    try {
      const lesson = await this.prisma.lesson.create({
        data: {
          chapterId,
          title: dto.title,
          videoUrl: dto.videoUrl,
          videoProvider: dto.videoProvider,
          orderIndex,
        },
      });

      // Notify ProgressModule so per-course lesson counts stay accurate
      this.eventEmitter.emit('lesson.created', {
        lessonId: lesson.id,
        chapterId,
        courseId: chapter.courseId,
      });

      return lesson;
    } catch (error) {
      // @@unique([chapterId, orderIndex]) — race condition safety net
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'A lesson with this order position already exists in this chapter.',
        );
      }
      throw error;
    }
  }

  /**
   * 3 — update(id, actor, dto)
   * Updates title and/or video. Bumps version on content change.
   * Validates ownership of the parent course before mutating.
   */
  async update(id: string, actor: IUser, dto: UpdateLessonDto) {
    const lesson = await this.verifyExistsWithCourse(id);
    this.coursesService.validateOwnership(lesson.chapter.course, actor);

    // Bump version whenever title or videoUrl changes to track content revisions
    const isContentUpdate = dto.title !== undefined || dto.videoUrl !== undefined;

    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        ...(isContentUpdate && { version: { increment: 1 } }),
      },
    });
  }

  /**
   * 4 — reorder(chapterId, actor, orderedIds)
   * Bulk updates orderIndex for all active lessons in a chapter.
   * Validates:
   *  - All IDs belong to this chapter
   *  - The list is complete — must include ALL active lessons to avoid
   *    stale orderIndex collisions with the @@unique constraint
   */
  async reorder(chapterId: string, actor: IUser, orderedIds: string[]) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        archivedAt: true,
        courseId: true,
        course: { select: { teacherUserId: true } },
      },
    });

    if (!chapter || chapter.archivedAt)
      throw new NotFoundException(`Chapter #${chapterId} not found`);
    this.coursesService.validateOwnership(chapter.course, actor);

    const existing = await this.prisma.lesson.findMany({
      where: { chapterId, archivedAt: null },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((l) => l.id));

    const foreignId = orderedIds.find((id) => !existingIds.has(id));
    if (foreignId) {
      throw new ForbiddenException(
        `Lesson #${foreignId} does not belong to chapter #${chapterId}.`,
      );
    }

    if (orderedIds.length !== existingIds.size) {
      throw new ConflictException(
        `Reorder list must include all ${existingIds.size} active lessons. Received ${orderedIds.length}.`,
      );
    }

    return this.prisma.$transaction(
      orderedIds.map((lessonId, index) =>
        this.prisma.lesson.update({
          where: { id: lessonId },
          data: { orderIndex: index + 1 },
        }),
      ),
    );
  }

  /**
   * 5 — softDelete(id, actor)
   * Archives a lesson (sets archivedAt).
   * Validates ownership of the parent course before mutating.
   * Emits 'lesson.deleted' for ProgressModule (lesson count tracking).
   */
  async softDelete(id: string, actor: IUser) {
    const lesson = await this.verifyExistsWithCourse(id);
    this.coursesService.validateOwnership(lesson.chapter.course, actor);

    const archived = await this.prisma.lesson.update({
      where: { id },
      data: { archivedAt: new Date() },
    });

    // Notify ProgressModule so per-course lesson counts stay accurate
    this.eventEmitter.emit('lesson.deleted', {
      lessonId: id,
      chapterId: lesson.chapterId,
      courseId: lesson.chapter.courseId,
    });

    return archived;
  }
}
