import { slugify } from '@lms/utils';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(teacherUserId: string, dto: CreateCourseDto) {
    const { teacherUserId: _dtoTeacherId, ...rest } = dto;
    const slug = slugify(dto.title);
    return this.prisma.course.create({
      data: {
        ...rest,
        slug,
        teacherUserId,
      },
    });
  }

  async findAll(params: { page: number; limit: number; search?: string; status?: string }) {
    const { page, limit, search, status } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

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

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true } },
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.title) data.slug = slugify(dto.title);
    return this.prisma.course.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.course.delete({ where: { id } });
  }
}
