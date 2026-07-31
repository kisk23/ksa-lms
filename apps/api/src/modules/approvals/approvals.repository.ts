import { Injectable } from '@nestjs/common';

import { ApprovalRequest, Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApprovalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new approval request in the database.
   * @param data The creation data matching Prisma's input type
   * @returns The created ApprovalRequest
   */
  async create(
    data: Prisma.ApprovalRequestUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ApprovalRequest> {
    const db = tx || this.prisma;
    return db.approvalRequest.create({
      data,
    });
  }

  /**
   * Retrieves a paginated list of approval requests, optionally filtered by status.
   * @param params Filtering and pagination parameters
   * @returns An array of ApprovalRequest objects and total count
   */
  async findAll(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.ApprovalRequestWhereInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const { skip, take, where } = params;
    const db = tx || this.prisma;

    const [items, total] = await db.$transaction([
      db.approvalRequest.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, name: true, email: true } },
          reviewer: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true } },
          lesson: { select: { id: true, title: true } },
        },
      }),
      db.approvalRequest.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Finds a single approval request by its ID with deep relations.
   * @param id The UUID of the approval request
   * @returns The ApprovalRequest object with course, chapters, and lessons, or null
   */
  async findById(id: string, tx?: Prisma.TransactionClient) {
    const db = tx || this.prisma;
    return db.approvalRequest.findUnique({
      where: { id },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } },
        course: {
          include: {
            teacher: { select: { id: true, name: true, email: true, phone: true } },
            chapters: {
              include: {
                lessons: true,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        lesson: true,
      },
    });
  }

  /**
   * Updates an existing approval request by ID.
   * @param id The UUID of the approval request
   * @param data The update payload
   * @returns The updated ApprovalRequest
   */
  async update(
    id: string,
    data: Prisma.ApprovalRequestUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ApprovalRequest> {
    const db = tx || this.prisma;
    return db.approvalRequest.update({
      where: { id },
      data,
    });
  }
}
