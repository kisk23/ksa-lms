import type { IUser } from '@lms/shared-types';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateChapterDto, UpdateChapterDto } from './dto';
import { Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChaptersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /**
   * Minimal fetch for write operations — only what's needed to verify
   * existence and ownership before mutating data.
   * Joins to parent course so validateOwnership can be called directly.
   */
  private async findForOwnershipCheck(id: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      select: {
        id: true,
        courseId: true,
        orderIndex: true,
        archivedAt: true,
        course: { select: { teacherUserId: true } },
      },
    });

    if (!chapter) throw new NotFoundException(`Chapter #${id} not found`);
    return chapter;
  }

  /**
   * Resolves the next available orderIndex for a new chapter within a course.
   * Uses MAX(orderIndex) + 1 so gaps left by soft-deleted chapters are never
   * reused and never collide with the @@unique([courseId, orderIndex]) constraint.
   */
  private async getNextOrderIndex(courseId: string): Promise<number> {
    const last = await this.prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    return (last?.orderIndex ?? 0) + 1;
  }

  // ─── PUBLIC METHODS ───────────────────────────────────────────────────────────

  /**
   * 1 — create(courseId, actor, dto)
   * Appends a new chapter at the end of the course's chapter list.
   *
   * Uses findForOwnershipCheck on the course (not findById) because the course
   * may still be in DRAFT status — teachers build out content before publishing.
   * findById would throw ForbiddenException on unpublished courses for non-staff.
   */
  async create(courseId: string, actor: IUser, dto: CreateChapterDto) {
    const course = await this.coursesService.findEssentials(courseId);
    this.coursesService.validateOwnership(course, actor);

    const orderIndex = await this.getNextOrderIndex(courseId);

    try {
      return await this.prisma.chapter.create({
        data: {
          courseId,
          title: dto.title,
          orderIndex,
        },
      });
    } catch (error) {
      // @@unique([courseId, orderIndex]) — race condition safety net
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'A chapter with this order position already exists. Please retry.',
        );
      }
      throw error;
    }
  }

  /**
   * 2 — update(id, actor, dto)
   * Updates title and/or orderIndex for a single chapter.
   */
  async update(id: string, actor: IUser, dto: UpdateChapterDto) {
    const chapter = await this.findForOwnershipCheck(id);
    this.coursesService.validateOwnership(chapter.course, actor);

    try {
      return await this.prisma.chapter.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          `Order position ${dto.orderIndex} is already taken by another chapter in this course.`,
        );
      }
      throw error;
    }
  }

  /**
   * 3 — reorder(courseId, actor, orderedIds)
   * Reassigns orderIndex for every chapter in one transaction.
   * The array position in orderedIds becomes the new orderIndex (1-based).
   *
   * Uses findEssentials (not findById) for the same reason as create —
   * the course may be in DRAFT while the teacher is building it out.
   *
   * Validates:
   *  - All provided IDs actually belong to this course
   *  - The list is complete — must reorder ALL active chapters, not a subset,
   *    otherwise unlisted chapters end up with stale orderIndex values that
   *    can collide with the @@unique([courseId, orderIndex]) constraint
   */
  async reorder(courseId: string, actor: IUser, orderedIds: string[]) {
    const course = await this.coursesService.findEssentials(courseId);
    this.coursesService.validateOwnership(course, actor);

    const existing = await this.prisma.chapter.findMany({
      where: { courseId, archivedAt: null },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((c) => c.id));

    const foreignId = orderedIds.find((id) => !existingIds.has(id));
    if (foreignId) {
      throw new ForbiddenException(`Chapter #${foreignId} does not belong to course #${courseId}.`);
    }

    if (orderedIds.length !== existingIds.size) {
      throw new ConflictException(
        `Reorder list must include all ${existingIds.size} active chapters. Received ${orderedIds.length}.`,
      );
    }

    return this.prisma.$transaction(
      orderedIds.map((chapterId, index) =>
        this.prisma.chapter.update({
          where: { id: chapterId },
          data: { orderIndex: index + 1 },
        }),
      ),
    );
  }

  /**
   * 4 — softDelete(id, actor)
   * Archives the chapter and cascades to all its lessons in one transaction.
   *
   * Does NOT emit lesson.deleted per lesson — this is a structural change
   * (reorganising course content), not a content removal. Emitting per lesson
   * would incorrectly decrement the student's progress totalLessons counter.
   *
   * NOTE: revisit when ProgressModule is built — a bulk event or a dedicated
   * chapter.archived event may be needed to keep progress counters accurate.
   */
  async softDelete(id: string, actor: IUser) {
    const chapter = await this.findForOwnershipCheck(id);
    this.coursesService.validateOwnership(chapter.course, actor);

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      await tx.lesson.updateMany({
        where: { chapterId: id, archivedAt: null },
        data: { archivedAt: now },
      });

      return tx.chapter.update({
        where: { id },
        data: { archivedAt: now },
      });
    });
  }
}
