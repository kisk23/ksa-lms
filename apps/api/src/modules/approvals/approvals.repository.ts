import { Injectable } from '@nestjs/common';

import { PrismaClient, ApprovalRequest, Prisma } from '../../generated/client';

@Injectable()
export class ApprovalsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new approval request in the database.
   * @param data The creation data matching Prisma's input type
   * @returns The created ApprovalRequest
   */
  async create(data: Prisma.ApprovalRequestUncheckedCreateInput): Promise<ApprovalRequest> {
    return this.prisma.approvalRequest.create({
      data,
    });
  }

  /**
   * Retrieves a paginated list of approval requests, optionally filtered by status.
   * @param params Filtering and pagination parameters
   * @returns An array of ApprovalRequest objects and total count
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ApprovalRequestWhereInput;
  }) {
    const { skip, take, where } = params;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.approvalRequest.findMany({
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
      this.prisma.approvalRequest.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Finds a single approval request by its ID with deep relations.
   * @param id The UUID of the approval request
   * @returns The ApprovalRequest object with course, chapters, and lessons, or null
   */
  async findById(id: string) {
    return this.prisma.approvalRequest.findUnique({
      where: { id },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } },
        course: {
          include: {
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
  ): Promise<ApprovalRequest> {
    return this.prisma.approvalRequest.update({
      where: { id },
      data,
    });
  }
}
