import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from './dto';
import { ParentRelationship, Prisma, UserRole } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { password, role, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 12);

    return this.prisma.user.create({
      data: {
        ...rest,
        role: role || UserRole.STUDENT,
        passwordHash,
      },
    });
  }

  async findAll(params: { role?: UserRole; page: number; limit: number; search?: string }) {
    const { role, page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { identity: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
          { guardianIdentity: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    const { password, ...rest } = dto;
    const data: Prisma.UserUpdateInput = { ...rest };

    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  async findByIdentity(identity: string) {
    return this.prisma.user.findUnique({ where: { identity } });
  }

  async findByIdentityOrPhoneOrEmail(identifier: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ identity: identifier }, { phone: identifier }, { email: identifier }],
      },
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new Error('SuperAdmin cannot be deactivated');
    }
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async linkChild(parentId: string, studentId: string, relationship: ParentRelationship) {
    // Verify student exists and has STUDENT role
    const student = await this.findOne(studentId);
    if (student.role !== UserRole.STUDENT) {
      throw new Error('User is not a student');
    }

    return this.prisma.parentStudentLink.create({
      data: {
        parentUserId: parentId,
        studentUserId: studentId,
        relationship,
      },
    });
  }

  async unlinkChild(parentId: string, studentId: string) {
    // We use deleteMany because we might not know the relationship type here,
    // and there should only be one link between a specific parent and student for a specific relationship anyway.
    // However, the schema allows multiple relationships. Usually, we want to remove ALL links between them.
    return this.prisma.parentStudentLink.deleteMany({
      where: {
        parentUserId: parentId,
        studentUserId: studentId,
      },
    });
  }

  async listChildren(parentId: string) {
    return this.prisma.parentStudentLink.findMany({
      where: { parentUserId: parentId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            identity: true,
            phone: true,
          },
        },
      },
    });
  }

  async setAssistantPermissions(granterId: string, assistantId: string, permissions: string[]) {
    const assistant = await this.findOne(assistantId);
    if (assistant.role !== UserRole.ASSISTANT_ADMIN) {
      throw new Error('User is not an assistant admin');
    }

    // Use transaction to update permissions
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Remove old permissions
      await tx.assistantPermission.deleteMany({
        where: { assistantUserId: assistantId },
      });

      // Add new ones
      return tx.assistantPermission.createMany({
        data: permissions.map((p) => ({
          assistantUserId: assistantId,
          permission: p,
          grantedBy: granterId,
        })),
      });
    });
  }
}
