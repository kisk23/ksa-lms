import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@lms/shared-types';
import { Prisma } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }

  async findAll(params: { role?: UserRole; page: number; limit: number; search?: string }) {
    const { role, page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { identity: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
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
    //can improve performance with 'one trip' depend on prisma error
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async findByIdentity(identity: string) {
    return this.prisma.user.findUnique({ where: { identity } });
  }

  async findByIdentityOrPhone(identifier: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { identity: identifier },
          { phone: identifier },
        ],
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
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async linkChild(parentId: string, studentId: string, relationship: any) {
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
