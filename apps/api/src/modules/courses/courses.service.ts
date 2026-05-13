import { UserRole, CourseStatus, CourseAuditAction, IUser } from '@lms/shared-types';
import { slugify } from '@lms/utils';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateCourseDto, UpdateCourseDto } from './dto';
import { Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Helper to fetch only essential fields for security/ownership checks.
   * Prevents heavy joins when we don't need the full content tree.
   */
  public async findEssentials(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: { id: true, teacherUserId: true, status: true, title: true },
    });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    return course;
  }

  /**
   * Helper to ensure a teacher only manages their own data.
   * Admins and Assistants bypass this check.
   */
  public validateOwnership(course: { teacherUserId: string }, actor: IUser) {
    if (actor.role === UserRole.TEACHER && course.teacherUserId !== actor.id) {
      throw new ForbiddenException('You are not authorized to manage this course.');
    }
  }

  /**
   * 1- findAll(filters)
   * List published courses with optional filter by teacher
   */
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    status?: CourseStatus;
    teacherUserId?: string;
  }) {
    const { page, limit, search, status, teacherUserId } = params;
    const skip = (page - 1) * limit;

    // Build the 'where' object once so it's reusable for both query and count
    const where: Prisma.CourseWhereInput = {
      ...(status && { status }),
      ...(teacherUserId && { teacherUserId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: { select: { id: true, name: true } },
          _count: { select: { enrollments: true, chapters: true } },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * 2- findById(id, actor)
   * Get course with security check for drafts
   */
  async findById(id: string, actor?: IUser) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true } },
        chapters: {
          where: { archivedAt: null },
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              where: { archivedAt: null },
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                orderIndex: true,
                createdAt: true,
                updatedAt: true,
                // videoUrl is intentionally excluded —
                // it is only returned by GET /dashboard/courses/:id
              },
            },
          },
        },
      },
    });

    if (!course) throw new NotFoundException(`Course #${id} not found`);

    // Draft/archived courses are only visible to their owner and staff
    const isPublished = course.status === CourseStatus.PUBLISHED;
    const isOwner = actor && course.teacherUserId === actor.id;
    const isStaff =
      actor && (actor.role === UserRole.SUPER_ADMIN || actor.role === UserRole.ASSISTANT_ADMIN);

    if (!isPublished && !isOwner && !isStaff) {
      throw new ForbiddenException('This course is not accessible.');
    }

    return course;
  }

  /**
   * 3- create(actor, dto)
   * Create course in DRAFT status with audit log
   */
  async create(actor: IUser, dto: CreateCourseDto) {
    const { teacherUserId: dtoTeacherId, ...rest } = dto;

    const teacherUserId = actor.role === UserRole.TEACHER ? actor.id : dtoTeacherId || actor.id;
    const slug = slugify(dto.title);

    return this.prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          ...rest,
          slug,
          teacherUserId,
          status: CourseStatus.DRAFT,
        },
      });

      await tx.courseAuditLog.create({
        data: {
          courseId: course.id,
          action: CourseAuditAction.CREATED,
          performedBy: actor.id,
          metadata: { title: course.title },
        },
      });

      return course;
    });
  }

  /**
   * 4- update(id, actor, dto)
   */
  async update(id: string, actor: IUser, dto: UpdateCourseDto) {
    const course = await this.findEssentials(id);
    this.validateOwnership(course, actor);

    const { teacherUserId: _, ...rest } = dto;
    const data: Record<string, unknown> = { ...rest };
    if (dto.title) data.slug = slugify(dto.title);

    return this.prisma.$transaction(async (tx) => {
      const updatedCourse = await tx.course.update({
        where: { id },
        data,
      });

      await tx.courseAuditLog.create({
        data: {
          courseId: id,
          action: CourseAuditAction.UPDATED,
          performedBy: actor.id,
          metadata: { changes: Object.keys(data) },
        },
      });

      this.eventEmitter.emit('course.updated', updatedCourse);
      return updatedCourse;
    });
  }

  /**
   * 5- publish(id, actor)
   */
  async publish(id: string, actor: IUser) {
    const course = await this.findEssentials(id);
    this.validateOwnership(course, actor);

    return this.prisma.$transaction(async (tx) => {
      const publishedCourse = await tx.course.update({
        where: { id },
        data: {
          status: CourseStatus.PUBLISHED,
          publishedAt: new Date(),
          publishedBy: actor.id,
        },
      });

      await tx.courseAuditLog.create({
        data: {
          courseId: id,
          action: CourseAuditAction.PUBLISHED,
          performedBy: actor.id,
        },
      });

      this.eventEmitter.emit('course.published', publishedCourse);
      return publishedCourse;
    });
  }

  /**
   * 6- archive(id, actor)
   */
  async archive(id: string, actor: IUser) {
    const course = await this.findEssentials(id);
    this.validateOwnership(course, actor);

    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      // 1. Soft delete related lessons first (deepest level)
      await tx.lesson.updateMany({
        where: { chapter: { courseId: id } },
        data: { archivedAt: now },
      });

      // 2. Soft delete related chapters
      await tx.chapter.updateMany({
        where: { courseId: id },
        data: { archivedAt: now },
      });

      // 3. Soft delete the course itself and mark as ARCHIVED
      const archivedCourse = await tx.course.update({
        where: { id },
        data: {
          status: CourseStatus.ARCHIVED,
          archivedAt: now,
          archivedBy: actor.id,
        },
      });

      await tx.courseAuditLog.create({
        data: {
          courseId: id,
          action: CourseAuditAction.ARCHIVED,
          performedBy: actor.id,
        },
      });

      return archivedCourse;
    });
  }

  /**
   * 7- remove(id, actor)
   */
  async remove(id: string, actor: IUser) {
    const course = await this.findEssentials(id);

    // SECURITY: Even the owner (Teacher) cannot hard-delete.
    if (actor.role === UserRole.TEACHER) {
      throw new ForbiddenException(
        'Teachers are not permitted to hard-delete courses. Please use the Archive feature instead.',
      );
    }

    this.validateOwnership(course, actor);

    return this.prisma.$transaction(async (tx) => {
      // 1. Log deletion before record is gone
      await tx.courseAuditLog.create({
        data: {
          courseId: id,
          action: CourseAuditAction.DELETED,
          performedBy: actor.id,
          metadata: { title: course.title },
        },
      });

      // 2. Perform Hard Delete
      try {
        return await tx.course.delete({
          where: { id },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new BadRequestException(
              'Cannot hard delete this course because it has active enrollments or related records preventing deletion.',
            );
          }
        }
        throw error;
      }
    });
  }

  /**
   * 8- restore(id, actor)
   * Restores an ARCHIVED course back to DRAFT status
   */
  async restore(id: string, actor: IUser) {
    const course = await this.findEssentials(id);
    this.validateOwnership(course, actor);

    if (course.status !== CourseStatus.ARCHIVED) {
      throw new BadRequestException('Only archived courses can be restored.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Un-archive lessons
      await tx.lesson.updateMany({
        where: { chapter: { courseId: id } },
        data: { archivedAt: null },
      });

      // 2. Un-archive chapters
      await tx.chapter.updateMany({
        where: { courseId: id },
        data: { archivedAt: null },
      });

      // 3. Set course to DRAFT (so they can review before re-publishing)
      const restoredCourse = await tx.course.update({
        where: { id },
        data: {
          status: CourseStatus.DRAFT,
          archivedAt: null,
          archivedBy: null,
        },
      });

      await tx.courseAuditLog.create({
        data: {
          courseId: id,
          action: CourseAuditAction.RESTORED,
          performedBy: actor.id,
        },
      });

      return restoredCourse;
    });
  }
}
