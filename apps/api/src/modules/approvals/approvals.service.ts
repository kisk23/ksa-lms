import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ApprovalsRepository } from './approvals.repository';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ListApprovalsDto } from './dto/list-approvals.dto';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { ApprovalStatus, CourseStatus, Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly repository: ApprovalsRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Asserts that a course is editable by the given user.
   * Throws ForbiddenException if the user does not own the course, or if the course
   * is locked (PENDING_REVIEW or PUBLISHED).
   * @param courseId The UUID of the course to check
   * @param userId The UUID of the teacher trying to edit
   */
  async assertCourseIsEditable(courseId: string, userId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.teacherUserId !== userId) {
      throw new ForbiddenException('You do not have permission to edit this course.');
    }

    const nonEditableStatuses: CourseStatus[] = [
      CourseStatus.PUBLISHED,
      CourseStatus.PENDING_REVIEW,
      CourseStatus.ARCHIVED,
    ];
    if (nonEditableStatuses.includes(course.status)) {
      throw new ForbiddenException(
        `Course is currently in ${course.status} state and cannot be edited.`,
      );
    }
  }

  /**
   * Creates a new approval request for a teacher.
   * @param userId The UUID of the requesting teacher
   * @param dto The creation payload containing requestType, courseId, etc.
   * @returns The created approval request
   */
  async createApproval(userId: string, dto: CreateApprovalDto) {
    await this.assertCourseIsEditable(dto.courseId, userId);

    const existingPending = await this.prisma.approvalRequest.findFirst({
      where: { courseId: dto.courseId, status: ApprovalStatus.PENDING_REVIEW },
    });
    if (existingPending) {
      throw new BadRequestException('Course already has a pending approval request');
    }

    // Wrap the updates in a transaction to ensure database consistency
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the approval request
      const request = await this.repository.create(
        {
          requestType: dto.requestType,
          courseId: dto.courseId,
          lessonId: dto.lessonId,
          requestedBy: userId,
          status: ApprovalStatus.PENDING_REVIEW,
        },
        tx,
      );

      // 2. Mark previous non-resolved requests as SUPERSEDED
      await tx.approvalRequest.updateMany({
        where: {
          courseId: dto.courseId,
          status: { in: [ApprovalStatus.CHANGES_REQUESTED, ApprovalStatus.REJECTED] },
        },
        data: {
          status: ApprovalStatus.SUPERSEDED,
          supersededById: request.id,
        },
      });

      // 3. Lock the course in PENDING_REVIEW state
      await tx.course.update({
        where: { id: dto.courseId },
        data: { status: CourseStatus.PENDING_REVIEW },
      });

      return request;
    });
  }

  /**
   * Retrieves a paginated list of approval requests based on filters.
   * @param dto Pagination and filtering payload
   * @returns An object containing the items and pagination metadata
   */
  async listApprovals(dto: ListApprovalsDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ApprovalRequestWhereInput = {};
    if (dto.status) where.status = dto.status;
    if (dto.courseId) where.courseId = dto.courseId;
    if (dto.requestedBy) where.requestedBy = dto.requestedBy;

    if (dto.startDate || dto.endDate) {
      where.createdAt = {};
      if (dto.startDate) where.createdAt.gte = new Date(dto.startDate);
      if (dto.endDate) where.createdAt.lte = new Date(dto.endDate);
    }

    const { items, total } = await this.repository.findAll({ skip, take: limit, where });

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves the details of a single approval request.
   * @param id The UUID of the request
   * @returns The detailed request object with nested course curriculum
   */
  async getApprovalDetail(id: string) {
    const approval = await this.repository.findById(id);
    if (!approval) {
      throw new NotFoundException('Approval request not found');
    }
    return approval;
  }

  /**
   * Reviews an approval request by an admin, setting its new status and handling course side-effects.
   * @param id The UUID of the request to review
   * @param adminId The UUID of the reviewing admin
   * @param dto The review payload with status
   * @returns The updated approval request
   */
  async reviewApproval(id: string, adminId: string, dto: ReviewApprovalDto) {
    const approval = await this.repository.findById(id);
    if (!approval) {
      throw new NotFoundException('Approval request not found');
    }

    if (approval.status !== ApprovalStatus.PENDING_REVIEW) {
      throw new BadRequestException('This request has already been reviewed');
    }

    // Wrap the updates in a transaction to ensure database consistency
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update the approval request
      // (only reached if status was PENDING_REVIEW)
      const updatedApproval = await this.repository.update(
        id,
        {
          status: dto.status,
          rejectionReason: dto.rejectionReason,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
        tx,
      );

      // 2. Handle course status side-effects based on the review outcome
      if (dto.status === ApprovalStatus.APPROVED) {
        // 1. Fetch full course tree for snapshot
        const fullCourse = await tx.course.findUnique({
          where: { id: approval.courseId },
          include: {
            chapters: {
              where: { archivedAt: null },
              orderBy: { orderIndex: 'asc' },
              include: {
                lessons: {
                  where: { archivedAt: null },
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    assignment: {
                      include: {
                        questions: {
                          include: { options: true },
                          orderBy: { orderIndex: 'asc' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        // 2. Determine next version
        const lastSnapshot = await tx.courseSnapshot.findFirst({
          where: { courseId: approval.courseId },
          orderBy: { version: 'desc' },
        });
        const nextVersion = (lastSnapshot?.version ?? 0) + 1;

        // 3. Create immutable snapshot
        const snapshot = await tx.courseSnapshot.create({
          data: {
            courseId: approval.courseId,
            approvalId: id,
            version: nextVersion,
            snapshotData: fullCourse as unknown as Prisma.InputJsonValue,
            approvedBy: adminId,
          },
        });

        // 4. Publish course and link live snapshot
        await tx.course.update({
          where: { id: approval.courseId },
          data: {
            status: CourseStatus.PUBLISHED,
            publishedBy: adminId,
            publishedAt: new Date(),
            liveSnapshotId: snapshot.id,
          },
        });
      } else if (dto.status === ApprovalStatus.CHANGES_REQUESTED) {
        // change status to CHANGES_REQUESTED
        await tx.course.update({
          where: { id: approval.courseId },
          data: { status: CourseStatus.CHANGES_REQUESTED },
        });
      } else if (dto.status === ApprovalStatus.REJECTED) {
        // unlock course so teacher can edit again by returning it to DRAFT
        await tx.course.update({
          where: { id: approval.courseId },
          data: { status: CourseStatus.DRAFT },
        });
      }

      return updatedApproval;
    });
  }

  /**
   * Rolls back a course to a previous snapshot.
   */
  async rollbackToSnapshot(courseId: string, snapshotId: string, adminId: string) {
    return this.prisma.$transaction(async (tx) => {
      const targetSnapshot = await tx.courseSnapshot.findUnique({
        where: { id: snapshotId },
      });

      if (!targetSnapshot || targetSnapshot.courseId !== courseId) {
        throw new NotFoundException('Snapshot not found for this course');
      }

      // Determine next version
      const lastSnapshot = await tx.courseSnapshot.findFirst({
        where: { courseId },
        orderBy: { version: 'desc' },
      });
      const nextVersion = (lastSnapshot?.version ?? 0) + 1;

      // Create new snapshot with identical data to preserve history
      const newSnapshot = await tx.courseSnapshot.create({
        data: {
          courseId,
          approvalId: targetSnapshot.approvalId,
          version: nextVersion,
          snapshotData: targetSnapshot.snapshotData as unknown as Prisma.InputJsonValue,
          approvedBy: adminId,
        },
      });

      // Update course to point to new snapshot
      await tx.course.update({
        where: { id: courseId },
        data: {
          liveSnapshotId: newSnapshot.id,
        },
      });

      return newSnapshot;
    });
  }

  /**
   * Retrieves the count of unseen approval requests.
   * @returns Total count of unseen approval requests
   */
  async getUnseenCount() {
    return this.prisma.approvalRequest.count({
      where: { seen: false },
    });
  }

  /**
   * Marks an approval request as seen.
   * @param id The UUID of the request to mark as seen
   * @returns The updated approval request
   */
  async markAsSeen(id: string) {
    const approval = await this.repository.findById(id);
    if (!approval) {
      throw new NotFoundException('Approval request not found');
    }

    if (approval.seen) {
      return approval; // Already seen, do nothing
    }

    return this.repository.update(id, { seen: true });
  }
}
