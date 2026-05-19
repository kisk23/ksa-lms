import { IUser } from '@lms/shared-types';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { ICourseContext } from './decorators/course-context.decorator';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from './dto';
import { Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /**
   * When context is provided, the guard has already verified the entity→course
   * relationship via a DB query. We only validate teacher ownership here.
   * When context is absent (e.g. service called directly), we do the full DB walk.
   */
  private async verifyLessonOwnership(lessonId: string, actor: IUser, context?: ICourseContext) {
    if (context) {
      return this.coursesService.validateOwnership(context, actor);
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        chapter: {
          select: {
            course: { select: { id: true, teacherUserId: true } },
          },
        },
      },
    });

    if (!lesson) throw new NotFoundException(`Lesson #${lessonId} not found`);
    this.coursesService.validateOwnership(lesson.chapter.course, actor);
  }

  /**
   * See verifyLessonOwnership — same context-first pattern.
   */
  private async verifyAssignmentOwnership(
    assignmentId: string,
    actor: IUser,
    context?: ICourseContext,
  ) {
    if (context) {
      return this.coursesService.validateOwnership(context, actor);
    }

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        lesson: {
          select: {
            chapter: {
              select: {
                course: { select: { id: true, teacherUserId: true } },
              },
            },
          },
        },
      },
    });

    if (!assignment) throw new NotFoundException(`Assignment #${assignmentId} not found`);
    this.coursesService.validateOwnership(assignment.lesson.chapter.course, actor);
  }

  /**
   * See verifyLessonOwnership — same context-first pattern.
   */
  private async verifyQuestionOwnership(
    questionId: string,
    actor: IUser,
    context?: ICourseContext,
  ) {
    if (context) {
      return this.coursesService.validateOwnership(context, actor);
    }

    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        assignment: {
          select: {
            lesson: {
              select: {
                chapter: {
                  select: {
                    course: { select: { id: true, teacherUserId: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) throw new NotFoundException(`Question #${questionId} not found`);
    this.coursesService.validateOwnership(question.assignment.lesson.chapter.course, actor);
  }

  // ─── PUBLIC METHODS ───────────────────────────────────────────────────────────

  /**
   * 1 — findByLesson(lessonId)
   * Returns the active assignment with questions and options ordered by index.
   */
  async findByLesson(lessonId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    });

    if (!assignment || assignment.archivedAt) {
      throw new NotFoundException(`Assignment for lesson #${lessonId} not found`);
    }

    return assignment;
  }

  /**
   * 2 — create(lessonId, actor, dto, context?)
   */
  async create(lessonId: string, actor: IUser, dto: CreateAssignmentDto, context?: ICourseContext) {
    await this.verifyLessonOwnership(lessonId, actor, context);

    try {
      return await this.prisma.assignment.create({
        data: {
          lessonId,
          passingScorePct: dto.passingScorePct || 50,
          maxAttempts: dto.maxAttempts || 100,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`An assignment for lesson #${lessonId} already exists.`);
      }
      throw error;
    }
  }

  /**
   * 3 — update(id, actor, dto, context?)
   */
  async update(id: string, actor: IUser, dto: UpdateAssignmentDto, context?: ICourseContext) {
    await this.verifyAssignmentOwnership(id, actor, context);

    return this.prisma.assignment.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * 4 — archive(id, actor, context?)
   * Soft-deletes the assignment. Throws if already archived.
   */
  async archive(id: string, actor: IUser, context?: ICourseContext) {
    await this.verifyAssignmentOwnership(id, actor, context);

    const current = await this.prisma.assignment.findUnique({
      where: { id },
      select: { archivedAt: true },
    });

    if (!current) throw new NotFoundException(`Assignment #${id} not found`);
    if (current.archivedAt) throw new ConflictException('Assignment is already archived.');

    return this.prisma.assignment.update({
      where: { id },
      data: {
        archivedAt: new Date(),
        archivedBy: actor.id,
      },
    });
  }

  /**
   * 5 — restore(id, actor, context?)
   * Restores a soft-deleted assignment. Throws if not archived.
   */
  async restore(id: string, actor: IUser, context?: ICourseContext) {
    await this.verifyAssignmentOwnership(id, actor, context);

    const current = await this.prisma.assignment.findUnique({
      where: { id },
      select: { archivedAt: true },
    });

    if (!current) throw new NotFoundException(`Assignment #${id} not found`);
    if (!current.archivedAt) throw new BadRequestException('Assignment is not archived.');

    return this.prisma.assignment.update({
      where: { id },
      data: {
        archivedAt: null,
        archivedBy: null,
      },
    });
  }

  /**
   * 6 — addQuestion(assignmentId, actor, dto, context?)
   * Adds a question with its options in a single transaction.
   * orderIndex is derived from array position (1-based) — not accepted from client.
   */
  async addQuestion(
    assignmentId: string,
    actor: IUser,
    dto: CreateQuestionDto,
    context?: ICourseContext,
  ) {
    await this.verifyAssignmentOwnership(assignmentId, actor, context);

    const last = await this.prisma.question.findFirst({
      where: { assignmentId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    const orderIndex = (last?.orderIndex ?? 0) + 1;

    return this.prisma.$transaction(async (tx) => {
      return tx.question.create({
        data: {
          assignmentId,
          text: dto.text,
          orderIndex,
          options: {
            create: dto.options.map((opt, i) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
              orderIndex: i + 1,
            })),
          },
        },
        include: { options: { orderBy: { orderIndex: 'asc' } } },
      });
    });
  }

  /**
   * 7 — updateQuestion(id, actor, dto, context?)
   * Updates question text and fully replaces options when provided.
   * Option replacement is all-or-nothing — partial option updates are not supported.
   */
  async updateQuestion(id: string, actor: IUser, dto: UpdateQuestionDto, context?: ICourseContext) {
    await this.verifyQuestionOwnership(id, actor, context);

    return this.prisma.$transaction(async (tx) => {
      if (dto.options) {
        await tx.questionOption.deleteMany({ where: { questionId: id } });
      }

      return tx.question.update({
        where: { id },
        data: {
          ...(dto.text !== undefined && { text: dto.text }),
          ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
          ...(dto.options && {
            options: {
              create: dto.options.map((opt, i) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                orderIndex: i + 1,
              })),
            },
          }),
        },
        include: { options: { orderBy: { orderIndex: 'asc' } } },
      });
    });
  }

  /**
   * 8 — deleteQuestion(id, actor, context?)
   * Hard-deletes a question. Cascades to options via DB constraint.
   */
  async deleteQuestion(id: string, actor: IUser, context?: ICourseContext) {
    await this.verifyQuestionOwnership(id, actor, context);

    return this.prisma.question.delete({ where: { id } });
  }
}
