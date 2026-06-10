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
import { ApprovalStatus, PrismaClient, CourseStatus, Prisma } from '../../generated/client';

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly repository: ApprovalsRepository,
    private readonly prisma: PrismaClient,
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
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
        tx,
      );

      // 2. Handle course status side-effects based on the review outcome
      if (dto.status === ApprovalStatus.APPROVED) {
        // publish course if approved
        await tx.course.update({
          where: { id: approval.courseId },
          data: { status: CourseStatus.PUBLISHED, publishedBy: adminId, publishedAt: new Date() },
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
}
