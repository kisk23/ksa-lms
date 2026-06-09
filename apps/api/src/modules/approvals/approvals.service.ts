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

    if (course.status === CourseStatus.PUBLISHED) {
      throw new ForbiddenException('Course is already published and cannot be edited directly.');
    }

    if (course.status === CourseStatus.PENDING_REVIEW) {
      throw new ForbiddenException('Course is currently pending review and is locked for editing.');
    }
  }

  /**
   * Creates a new approval request for a teacher.
   * @param userId The UUID of the requesting teacher
   * @param dto The creation payload containing requestType, courseId, etc.
   * @returns The created approval request
   */
  async createApproval(userId: string, dto: CreateApprovalDto) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.teacherUserId !== userId) {
      throw new ForbiddenException('You can only submit approval requests for your own courses');
    }

    // Wrap the updates in a transaction to ensure database consistency
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the approval request
      const request = await tx.approvalRequest.create({
        data: {
          requestType: dto.requestType,
          courseId: dto.courseId,
          lessonId: dto.lessonId,
          requestedBy: userId,
          status: ApprovalStatus.PENDING_REVIEW,
        },
      });

      // 2. Lock the course in PENDING_REVIEW state
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

    const where = dto.status ? { status: dto.status } : {};

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
      const updatedApproval = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: dto.status,
          reviewedBy: adminId,
        },
      });

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
