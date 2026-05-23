import { EnrollmentStatus, UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

import { CreateManualEnrollmentDto } from './dto/create-enrollment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /**
   * Minimal fetch for existence + status checks.
   * Avoids heavy joins on write paths.
   */
  private async findForCheck(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      select: {
        id: true,
        studentUserId: true,
        courseId: true,
        status: true,
        paymentId: true,
      },
    });

    if (!enrollment) throw new NotFoundException(`Enrollment #${id} not found`);
    return enrollment;
  }

  // ─── PUBLIC METHODS ───────────────────────────────────────────────────────────

  /**
   * 1 — findByStudent(userId)
   *
   * Returns the full enrollment history for a student, including all statuses
   * except PENDING (payment not confirmed yet — the student has no access and
   * no meaningful action to take on those rows).
   *
   * ACTIVE, COMPLETED, EXPIRED, and CANCELLED rows are all returned so the
   * student can see past courses alongside current ones.
   */
  async findByStudent(userId: string) {
    return this.prisma.enrollment.findMany({
      where: {
        studentUserId: userId,
        status: { not: EnrollmentStatus.PENDING },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
            teacher: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  /**
   * 2 — findByCourse(courseId, actor)
   *
   * Returns all non-PENDING enrolled students for a course.
   * Teacher access is validated against course ownership — they can only see
   * their own courses. Staff see everything.
   */
  async findByCourse(courseId: string, actor: IUser) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherUserId: true },
    });

    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    if (actor.role === UserRole.TEACHER && course.teacherUserId !== actor.id) {
      throw new ForbiddenException('You are not authorized to view enrollments for this course.');
    }

    return this.prisma.enrollment.findMany({
      where: {
        courseId,
        status: { not: EnrollmentStatus.PENDING },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  /**
   * 3 — createManual(dto, enrolledBy)
   *
   * Offline / admin-initiated enrollment.
   * Skips PENDING state entirely — goes directly to ACTIVE.
   * Emits 'enrollment.created' so ProgressModule can initialise a CourseProgress row.
   *
   * Re-enrollment logic:
   *  - ACTIVE        → reject (already enrolled)
   *  - PENDING       → reject (payment in flight — must resolve via payment flow)
   *  - CANCELLED / EXPIRED / COMPLETED → update existing row back to ACTIVE
   *    (cannot insert a new row — @@unique([studentUserId, courseId]) prevents it)
   */
  async createManual(dto: CreateManualEnrollmentDto, enrolledBy: IUser) {
    // FIX: Parallelise independent lookups — was 3 sequential round-trips
    const [course, student] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: dto.courseId },
        // FIX: removed 'status' and 'price' — fetched before but never used
        select: { id: true },
      }),
      this.prisma.user.findUnique({
        where: { id: dto.studentUserId },
        select: { id: true, role: true },
      }),
    ]);

    if (!course) throw new NotFoundException(`Course #${dto.courseId} not found`);
    if (!student) throw new NotFoundException(`Student #${dto.studentUserId} not found`);

    if (student.role !== UserRole.STUDENT) {
      throw new BadRequestException('The target user is not a student.');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        studentUserId_courseId: {
          studentUserId: dto.studentUserId,
          courseId: dto.courseId,
        },
      },
      select: { id: true, status: true },
    });

    if (existing) {
      if (existing.status === EnrollmentStatus.ACTIVE) {
        throw new ConflictException('Student is already actively enrolled in this course.');
      }

      if (existing.status === EnrollmentStatus.PENDING) {
        throw new ConflictException(
          'An enrollment for this student is pending payment confirmation. Use the payment flow instead.',
        );
      }

      // FIX: CANCELLED / EXPIRED / COMPLETED — update the existing row back to ACTIVE
      // rather than throwing. A new insert is impossible due to @@unique, and blocking
      // re-enrollment here creates a dead end (e.g. admin cancels after refund, then
      // wants to re-enroll the same student in the next semester).
      const reactivated = await this.prisma.enrollment.update({
        where: { id: existing.id },
        data: {
          status: EnrollmentStatus.ACTIVE,
          enrolledBy: enrolledBy.id,
          enrolledAt: new Date(),
          amountPaid: dto.amountPaid ?? 0,
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
          // paymentId stays null — still an offline enrollment
        },
        include: {
          course: { select: { id: true, title: true } },
          student: { select: { id: true, name: true, email: true } },
        },
      });

      this.eventEmitter.emit('enrollment.created', {
        studentUserId: dto.studentUserId,
        courseId: dto.courseId,
        enrollmentId: reactivated.id,
      });

      return reactivated;
    }

    // No existing row — fresh enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentUserId: dto.studentUserId,
        courseId: dto.courseId,
        enrolledBy: enrolledBy.id,
        amountPaid: dto.amountPaid ?? 0,
        status: EnrollmentStatus.ACTIVE,
        ...(dto.expiryDate && { expiryDate: new Date(dto.expiryDate) }),
        // paymentId intentionally null — no gateway involved
      },
      include: {
        course: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, email: true } },
      },
    });

    this.eventEmitter.emit('enrollment.created', {
      studentUserId: dto.studentUserId,
      courseId: dto.courseId,
      enrollmentId: enrollment.id,
    });

    return enrollment;
  }

  /**
   * 4 — activate(payload)
   *
   * Called by the 'payment.confirmed' event emitted by PaymentModule.
   * Transitions the enrollment from PENDING → ACTIVE and emits 'enrollment.created'
   * so ProgressModule can initialise the student's CourseProgress row.
   *
   * Idempotent — if the webhook fires twice the second call is a no-op.
   *
   * FIX: Wrapped in try/catch. NestJS event emitter does not propagate exceptions
   * back to the emitter — an unhandled error here would silently leave the student
   * with a confirmed payment but a PENDING enrollment (no course access).
   * We log the failure with full context so it can be manually recovered.
   */
  @OnEvent('payment.confirmed')
  async activate(payload: { paymentId: string }) {
    const { paymentId } = payload;

    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { paymentId },
        select: { id: true, status: true, studentUserId: true, courseId: true },
      });

      if (!enrollment) {
        // No row tied to this payment — nothing to activate.
        this.logger.warn(`activate: no enrollment found for paymentId=${paymentId}`);
        return;
      }

      if (enrollment.status === EnrollmentStatus.ACTIVE) {
        // Already activated (webhook retry) — idempotent, skip.
        return;
      }

      await this.prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: EnrollmentStatus.ACTIVE },
      });

      this.eventEmitter.emit('enrollment.created', {
        studentUserId: enrollment.studentUserId,
        courseId: enrollment.courseId,
        enrollmentId: enrollment.id,
      });
    } catch (error) {
      // FIX: Log with enough context to recover manually — do not rethrow because
      // the event emitter won't surface it and it would crash the handler silently.
      this.logger.error(
        `activate: failed to activate enrollment for paymentId=${paymentId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  /**
   * 5 — cancel(id)
   *
   * Soft-cancels an enrollment (sets status to CANCELLED).
   * Typically called by admin after a refund is processed.
   *
   * Does NOT delete the row — the record is needed for audit trail.
   * Does NOT touch CourseProgress — the student's history is preserved.
   *
   * Allowed from: ACTIVE, COMPLETED, EXPIRED
   * Blocked from: PENDING (must resolve via payment flow), CANCELLED (already done)
   */
  async cancel(id: string) {
    const enrollment = await this.findForCheck(id);

    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new ConflictException('Enrollment is already cancelled.');
    }

    if (enrollment.status === EnrollmentStatus.PENDING) {
      throw new BadRequestException(
        'Cannot cancel a PENDING enrollment directly. The payment flow must resolve first.',
      );
    }

    // FIX: COMPLETED and EXPIRED are now explicitly allowed through.
    // A completed student may need their access revoked (e.g. chargeback after course completion).
    // An expired enrollment can be cancelled for clean record-keeping.
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: EnrollmentStatus.CANCELLED },
    });
  }

  /**
   * 6 — isEnrolled(userId, courseId)
   *
   * Boolean check used by EnrollmentGuard and other guard layers.
   * Returns true only when the enrollment is ACTIVE.
   */
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentUserId_courseId: { studentUserId: userId, courseId },
      },
      select: { status: true },
    });

    return enrollment?.status === EnrollmentStatus.ACTIVE;
  }
}
