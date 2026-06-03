import { EnrollmentStatus, UserRole } from '@lms/shared-types';
import type { IUser } from '@lms/shared-types';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';

import {
  CreateManualEnrollmentDto,
  BulkEnrollDto,
  ExtendEnrollmentDto,
  TransferEnrollmentDto,
  AdminEnrollmentQueryDto,
} from './dto';
import { CourseAuditAction, Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /**
   * findForCheck(id)
   *
   * Minimal fetch used as the first step in every write operation (cancel,
   * extendExpiry, transfer). Selects only the fields needed for existence
   * verification, status validation, and event payloads — avoids loading
   * course/student relations that write paths don't need.
   *
   * Throws NotFoundException if the row does not exist so every caller
   * gets a consistent 404 without duplicating the check.
   */
  private async findForCheck(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      select: {
        id: true,
        studentUserId: true,
        courseId: true,
        status: true,
        expiryDate: true,
        amountPaid: true,
      },
    });

    if (!enrollment) throw new NotFoundException(`Enrollment #${id} not found`);
    return enrollment;
  }

  // ─── READ ─────────────────────────────────────────────────────────────────────

  /**
   * findByStudent(userId)
   *
   * Returns the full enrollment history for a student ordered by most recent first.
   * PENDING rows are excluded — they represent payments in flight where the
   * student has no course access yet and nothing actionable to see.
   * ACTIVE, COMPLETED, EXPIRED, and CANCELLED are all returned so the student
   * has a complete picture of their past and current courses.
   *
   * Includes a course summary (title, slug, thumbnail, teacher name) to
   * support rendering enrollment cards on the student home screen without
   * a second request.
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
   * findById(id, actor)
   *
   * Returns a single enrollment record with full course and student details.
   * Ownership rules are enforced at the service layer (not just the guard):
   *   STUDENT       → may only fetch their own enrollment
   *   TEACHER       → may only fetch enrollments for courses they own
   *   SUPER_ADMIN /
   *   ASSISTANT_ADMIN → no restriction, see everything
   *
   * teacherUserId is selected from the course relation so ownership can be
   * checked without a separate course query.
   */
  async findById(id: string, actor: IUser) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, teacherUserId: true } },
        student: { select: { id: true, name: true, email: true } },
      },
    });

    if (!enrollment) throw new NotFoundException(`Enrollment #${id} not found`);

    if (actor.role === UserRole.STUDENT && enrollment.studentUserId !== actor.id) {
      throw new ForbiddenException('You are not authorized to view this enrollment.');
    }

    if (actor.role === UserRole.TEACHER && enrollment.course.teacherUserId !== actor.id) {
      throw new ForbiddenException('You are not authorized to view this enrollment.');
    }

    return enrollment;
  }

  /**
   * findByCourse(courseId, actor)
   *
   * Returns all non-PENDING enrollments for a course, ordered by enrolment date.
   * Used to populate the teacher's student roster view.
   *
   * Ownership is verified before querying — a teacher attempting to see
   * another teacher's roster receives a 403, not an empty list.
   * Staff (SUPER_ADMIN, ASSISTANT_ADMIN) bypass the ownership check.
   *
   * PENDING rows are excluded from the list because they represent unconfirmed
   * payments — those students do not yet have course access.
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
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  /**
   * getStats(courseId, actor)
   *
   * Returns enrollment counts grouped by status for a single course.
   * Designed for the teacher/admin dashboard enrollment distribution panel.
   *
   * Uses a single groupBy query instead of five separate count() calls —
   * one DB round-trip regardless of how many status values exist.
   * The result is normalised into a fixed-shape object so the response
   * shape is always predictable even when some statuses have zero enrollments.
   *
   * Ownership rules mirror findByCourse() — teachers only see their own courses.
   */
  async getStats(courseId: string, actor: IUser) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherUserId: true },
    });

    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    if (actor.role === UserRole.TEACHER && course.teacherUserId !== actor.id) {
      throw new ForbiddenException('You are not authorized to view statistics for this course.');
    }

    const stats = await this.prisma.enrollment.groupBy({
      by: ['status'],
      where: { courseId },
      _count: { _all: true },
    });

    const response = { active: 0, completed: 0, expired: 0, cancelled: 0, pending: 0, total: 0 };

    for (const group of stats) {
      const count = group._count._all;
      response.total += count;

      if (group.status === EnrollmentStatus.ACTIVE) response.active = count;
      if (group.status === EnrollmentStatus.COMPLETED) response.completed = count;
      if (group.status === EnrollmentStatus.EXPIRED) response.expired = count;
      if (group.status === EnrollmentStatus.CANCELLED) response.cancelled = count;
      if (group.status === EnrollmentStatus.PENDING) response.pending = count;
    }

    return response;
  }

  /**
   * findGlobal(query)
   *
   * System-wide paginated enrollment view for SUPER_ADMIN and ASSISTANT_ADMIN.
   * Mirrors the pattern used in CourseProgressService.findGlobalProgress().
   *
   * Filtering:
   *   studentId → exact match on studentUserId
   *   courseId  → exact match on courseId
   *   status    → exact match on EnrollmentStatus enum
   *   search    → case-insensitive partial match on student name, student email,
   *               or course title — uses top-level OR to avoid overwriting the
   *               student filter when studentId is also provided
   *
   * Runs count() and findMany() in parallel (Promise.all) so pagination metadata
   * and data are fetched in a single DB round-trip pair.
   */
  async findGlobal(query: AdminEnrollmentQueryDto) {
    const { courseId, studentId, status, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {
      ...(courseId && { courseId }),
      ...(studentId && { studentUserId: studentId }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { student: { name: { contains: search, mode: 'insensitive' } } },
          { student: { email: { contains: search, mode: 'insensitive' } } },
          { course: { title: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.enrollment.count({ where }),
      this.prisma.enrollment.findMany({
        where,
        include: {
          student: { select: { id: true, name: true, email: true, phone: true } },
          course: { select: { id: true, title: true } },
        },
        orderBy: { enrolledAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  // ─── WRITE ────────────────────────────────────────────────────────────────────

  /**
   * createManual(dto, enrolledBy)
   *
   * Admin / assistant offline enrollment — bypasses the payment flow entirely
   * and sets the enrollment directly to ACTIVE.
   *
   * Steps:
   *  1. Validate course and student exist in parallel (Promise.all)
   *  2. Confirm the target user has the STUDENT role
   *  3. Check for an existing enrollment row on (studentUserId, courseId):
   *     a. ACTIVE  → throw ConflictException — already enrolled
   *     b. PENDING → throw ConflictException — payment in flight, use payment flow
   *     c. CANCELLED / EXPIRED / COMPLETED → UPDATE existing row back to ACTIVE
   *        and emit 'enrollment.reactivated' so CourseProgress is preserved
   *     d. No row → INSERT new ACTIVE row and emit 'enrollment.created' so
   *        CourseProgressService initialises a fresh progress row
   *
   * Re-inserting is impossible due to @@unique([studentUserId, courseId]) on the
   * schema — this is why CANCELLED/EXPIRED/COMPLETED trigger an UPDATE, not INSERT.
   *
   * amountPaid is converted to Prisma.Decimal before the write to avoid
   * floating-point precision issues with the Decimal(10,2) schema field.
   */
  async createManual(dto: CreateManualEnrollmentDto, enrolledBy: IUser) {
    const [course, student] = await Promise.all([
      this.prisma.course.findUnique({ where: { id: dto.courseId }, select: { id: true } }),
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

    const parsedAmount = new Prisma.Decimal(dto.amountPaid ?? '0.00');

    // Run inside a transaction with an advisory lock to prevent race conditions
    const result = await this.prisma.$transaction(async (tx) => {
      // Acquire a transaction-level advisory lock on (studentUserId, courseId)
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(
          hashtext(${dto.studentUserId}::text), 
          hashtext(${dto.courseId}::text)
        )
      `;

      // Safely read the current enrollment state under the lock
      const existing = await tx.enrollment.findUnique({
        where: {
          studentUserId_courseId: { studentUserId: dto.studentUserId, courseId: dto.courseId },
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

        // Reactivate existing CANCELLED/EXPIRED/COMPLETED row
        const reactivated = await tx.enrollment.update({
          where: { id: existing.id },
          data: {
            status: EnrollmentStatus.ACTIVE,
            enrolledBy: enrolledBy.id,
            enrolledAt: new Date(),
            amountPaid: parsedAmount,
            expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
          },
          include: {
            course: { select: { id: true, title: true } },
            student: { select: { id: true, name: true, email: true } },
          },
        });

        return { enrollment: reactivated, action: 'reactivated' as const };
      }

      // Fresh manual enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          studentUserId: dto.studentUserId,
          courseId: dto.courseId,
          enrolledBy: enrolledBy.id,
          amountPaid: parsedAmount,
          status: EnrollmentStatus.ACTIVE,
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        },
        include: {
          course: { select: { id: true, title: true } },
          student: { select: { id: true, name: true, email: true } },
        },
      });

      return { enrollment, action: 'created' as const };
    });

    // Emit event outside the transaction to prevent orphaned rows on rollback
    if (result.action === 'reactivated') {
      this.eventEmitter.emit('enrollment.reactivated', {
        studentUserId: dto.studentUserId,
        courseId: dto.courseId,
        enrollmentId: result.enrollment.id,
      });
    } else {
      this.eventEmitter.emit('enrollment.created', {
        studentUserId: dto.studentUserId,
        courseId: dto.courseId,
        enrollmentId: result.enrollment.id,
      });
    }

    return result.enrollment;
  }

  /**
   * bulkEnroll(dto, enrolledBy)
   *
   * Enrolls up to 100 students into a single course in one request.
   * Designed for offline batch operations (class registration, semester start).
   *
   * Steps:
   *  1. Verify the target course exists
   *  2. Pre-fetch all referenced students and existing enrollments in 2 parallel
   *     queries — avoids up to 200 individual DB queries for a 100-student batch
   *  3. Loop through each student independently:
   *     a. Not found in DB          → skip with reason
   *     b. Role is not STUDENT      → skip with reason
   *     c. Already ACTIVE           → skip with reason
   *     d. PENDING                  → skip with reason (payment in flight)
   *     e. CANCELLED/EXPIRED/COMPLETED → UPDATE to ACTIVE, emit 'enrollment.reactivated'
   *     f. No existing row          → INSERT new ACTIVE row, emit 'enrollment.created'
   *
   * Never throws on partial failure — each student is processed independently so
   * one invalid entry does not roll back the other 99. The response includes a
   * full per-student result report and a summary counter.
   *
   * Each successful operation emits its own event so CourseProgressService
   * handles progress initialisation per student individually, same as createManual().
   */
  async bulkEnroll(dto: BulkEnrollDto, enrolledBy: IUser) {
    const { courseId, students } = dto;

    if (students.length === 0) {
      throw new BadRequestException('Students list cannot be empty.');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    const studentIds = students.map((s) => s.studentUserId);

    const [fetchedStudents, existingEnrollments] = await Promise.all([
      this.prisma.user.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, role: true },
      }),
      this.prisma.enrollment.findMany({
        where: { courseId, studentUserId: { in: studentIds } },
        select: { id: true, studentUserId: true, status: true },
      }),
    ]);

    const studentMap = new Map(fetchedStudents.map((s) => [s.id, s]));
    const enrollmentMap = new Map(existingEnrollments.map((e) => [e.studentUserId, e]));

    const summary = { enrolled: 0, reactivated: 0, skipped: 0, total: students.length };
    const results: Array<{
      studentUserId: string;
      status: 'enrolled' | 'reactivated' | 'skipped';
      reason?: string;
    }> = [];

    for (const item of students) {
      const { studentUserId, amountPaid, expiryDate } = item;
      const targetUser = studentMap.get(studentUserId);
      const existing = enrollmentMap.get(studentUserId);
      const parsedAmount = new Prisma.Decimal(amountPaid ?? '0.00');

      if (!targetUser) {
        summary.skipped++;
        results.push({ studentUserId, status: 'skipped', reason: 'Student not found.' });
        continue;
      }

      if (targetUser.role !== UserRole.STUDENT) {
        summary.skipped++;
        results.push({ studentUserId, status: 'skipped', reason: 'User role is not STUDENT.' });
        continue;
      }

      if (existing) {
        if (existing.status === EnrollmentStatus.ACTIVE) {
          summary.skipped++;
          results.push({ studentUserId, status: 'skipped', reason: 'Already actively enrolled.' });
          continue;
        }

        if (existing.status === EnrollmentStatus.PENDING) {
          summary.skipped++;
          results.push({
            studentUserId,
            status: 'skipped',
            reason: 'Enrollment pending payment confirmation.',
          });
          continue;
        }

        try {
          await this.prisma.enrollment.update({
            where: { id: existing.id },
            data: {
              status: EnrollmentStatus.ACTIVE,
              enrolledBy: enrolledBy.id,
              enrolledAt: new Date(),
              amountPaid: parsedAmount,
              expiryDate: expiryDate ? new Date(expiryDate) : null,
            },
          });

          this.eventEmitter.emit('enrollment.reactivated', {
            studentUserId,
            courseId,
            enrollmentId: existing.id,
          });

          summary.reactivated++;
          results.push({ studentUserId, status: 'reactivated' });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            summary.skipped++;
            results.push({
              studentUserId,
              status: 'skipped',
              reason: 'Already actively enrolled.',
            });
          } else {
            throw error;
          }
        }
      } else {
        try {
          const created = await this.prisma.enrollment.create({
            data: {
              studentUserId,
              courseId,
              enrolledBy: enrolledBy.id,
              amountPaid: parsedAmount,
              status: EnrollmentStatus.ACTIVE,
              expiryDate: expiryDate ? new Date(expiryDate) : null,
            },
          });

          this.eventEmitter.emit('enrollment.created', {
            studentUserId,
            courseId,
            enrollmentId: created.id,
          });

          summary.enrolled++;
          results.push({ studentUserId, status: 'enrolled' });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            summary.skipped++;
            results.push({
              studentUserId,
              status: 'skipped',
              reason: 'Already actively enrolled.',
            });
          } else {
            throw error;
          }
        }
      }
    }

    return { summary, results };
  }

  /**
   * activate(payload)
   *
   * Listens for the 'payment.confirmed' event emitted by PaymentModule after
   * Moyasar confirms a successful payment via webhook.
   * Transitions the enrollment from PENDING → ACTIVE and emits 'enrollment.created'
   * so CourseProgressService can initialise the student's CourseProgress row.
   *
   * Idempotency:
   *   If the webhook fires more than once for the same payment (common with
   *   payment gateways), the second call finds the row already ACTIVE and
   *   returns without making any changes.
   *
   * Error handling:
   *   Wrapped in try/catch because @OnEvent handlers are fire-and-forget —
   *   NestJS does not propagate exceptions from event listeners back to the
   *   emitter. An uncaught error here would silently leave the student with a
   *   confirmed payment but a PENDING enrollment (no course access).
   *   logger.error() provides a recoverable paper trail for manual intervention.
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
        this.logger.warn(`activate: no enrollment found for paymentId=${paymentId}`);
        return;
      }

      if (enrollment.status === EnrollmentStatus.ACTIVE) {
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
      this.logger.error(
        `activate: failed to activate enrollment for paymentId=${paymentId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  /**
   * cancel(id)
   *
   * Soft-cancels an enrollment by setting its status to CANCELLED.
   * Typically called by an admin after a refund is processed.
   *
   * The row is never deleted — it is kept permanently for audit trail and to
   * preserve the student's CourseProgress history. The student loses course
   * access immediately because isEnrolled() checks for ACTIVE status.
   *
   * Emits 'enrollment.cancelled' so NotificationModule can inform the student
   * their access has been revoked without EnrollmentModule knowing about notifications.
   *
   * Allowed from: ACTIVE, COMPLETED, EXPIRED
   * Blocked from:
   *   CANCELLED → ConflictException (already done)
   *   PENDING   → BadRequestException (payment flow must resolve first)
   */
  async cancel(id: string, actorId: string) {
    const enrollment = await this.findForCheck(id);

    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new ConflictException('Enrollment is already cancelled.');
    }

    if (enrollment.status === EnrollmentStatus.PENDING) {
      throw new BadRequestException(
        'Cannot cancel a PENDING enrollment directly. The payment flow must resolve first.',
      );
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.enrollment.update({
        where: { id },
        data: { status: EnrollmentStatus.CANCELLED },
      }),
      this.prisma.courseAuditLog.create({
        data: {
          courseId: enrollment.courseId,
          action: CourseAuditAction.UPDATED,
          performedBy: actorId,
          metadata: {
            type: 'ENROLLMENT_CANCELLED',
            enrollmentId: enrollment.id,
            studentUserId: enrollment.studentUserId,
            previousStatus: enrollment.status,
          },
        },
      }),
    ]);
    this.eventEmitter.emit('enrollment.cancelled', {
      studentUserId: enrollment.studentUserId,
      courseId: enrollment.courseId,
      enrollmentId: id,
    });
    return updated;
  }

  /**
   * extendExpiry(id, dto)
   *
   * Updates the expiryDate on an enrollment to grant a student more access time.
   * If the enrollment was EXPIRED, it is automatically transitioned back to ACTIVE
   * and 'enrollment.reactivated' is emitted so CourseProgressService can ensure
   * a progress row exists (without resetting existing progress).
   *
   * Validation:
   *   - New date must be in the future
   *   - PENDING   → blocked (no expiry concept during payment flow)
   *   - CANCELLED → blocked (re-enroll manually instead)
   *
   * The wasExpired flag determines whether a status change is needed alongside
   * the date update — ACTIVE enrollments only get a date update, no status change.
   */
  async extendExpiry(id: string, dto: ExtendEnrollmentDto, actorId: string) {
    const enrollment = await this.findForCheck(id);

    if (enrollment.status === EnrollmentStatus.PENDING) {
      throw new BadRequestException('Cannot extend a PENDING enrollment.');
    }

    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot extend a CANCELLED enrollment. Re-enroll manually instead.',
      );
    }

    const newDate = new Date(dto.expiryDate);
    if (newDate <= new Date()) {
      throw new BadRequestException('New expiry date must be in the future.');
    }

    const wasExpired = enrollment.status === EnrollmentStatus.EXPIRED;

    const [updated] = await this.prisma.$transaction([
      this.prisma.enrollment.update({
        where: { id },
        data: {
          expiryDate: newDate,
          ...(wasExpired && { status: EnrollmentStatus.ACTIVE }),
        },
      }),
      this.prisma.courseAuditLog.create({
        data: {
          courseId: enrollment.courseId,
          action: CourseAuditAction.UPDATED,
          performedBy: actorId,
          metadata: {
            type: 'ENROLLMENT_EXTENDED',
            enrollmentId: enrollment.id,
            studentUserId: enrollment.studentUserId,
            previousExpiryDate: enrollment.expiryDate,
            newExpiryDate: newDate,
            resurrected: wasExpired,
          },
        },
      }),
    ]);
    if (wasExpired) {
      this.eventEmitter.emit('enrollment.reactivated', {
        studentUserId: enrollment.studentUserId,
        courseId: enrollment.courseId,
        enrollmentId: id,
      });
    }
    return updated;
  }

  /**
   * transfer(id, dto, actorId)
   *
   * Moves a student's ACTIVE enrollment from one course to another.
   * Designed for cases where a student enrolled in the wrong course.
   *
   * Steps (all inside one transaction to guarantee atomicity):
   *  1. Validate source is ACTIVE, target course exists, and they are different
   *  2. Check the student's enrollment state in the target course:
   *     a. ACTIVE  → throw ConflictException (already there)
   *     b. PENDING → throw ConflictException (payment in flight)
   *     c. CANCELLED / EXPIRED / COMPLETED → will be reactivated inside tx
   *     d. No row → will be created inside tx
   *  3. Inside transaction:
   *     a. Cancel the source enrollment
   *     b. Update (reactivate) or create the target enrollment
   *        — actorId is set as enrolledBy in both branches for audit trail
   *        — source expiryDate is carried over so the student doesn't lose time
   *        — targetEnrollmentId is captured from the tx result (no extra query)
   *  4. Fire events outside the transaction:
   *     — 'enrollment.cancelled' for the source course
   *     — 'enrollment.created' for the target course (triggers progress init)
   *
   * Events fire outside the transaction intentionally — firing inside would run
   * CourseProgressService DB writes while the enrollment transaction is still open.
   * If the outer tx rolled back, orphaned progress rows would remain.
   */
  async transfer(id: string, dto: TransferEnrollmentDto, actorId: string) {
    const source = await this.findForCheck(id);

    if (source.status !== EnrollmentStatus.ACTIVE) {
      throw new ConflictException('Only active enrollments can be transferred.');
    }

    const targetCourse = await this.prisma.course.findUnique({
      where: { id: dto.targetCourseId },
      select: { id: true },
    });

    if (!targetCourse)
      throw new NotFoundException(`Target course #${dto.targetCourseId} not found`);

    if (source.courseId === dto.targetCourseId) {
      throw new BadRequestException('Source and target courses must be different.');
    }

    const existingTarget = await this.prisma.enrollment.findUnique({
      where: {
        studentUserId_courseId: {
          studentUserId: source.studentUserId,
          courseId: dto.targetCourseId,
        },
      },
      select: { id: true, status: true },
    });

    if (existingTarget?.status === EnrollmentStatus.ACTIVE) {
      throw new ConflictException('Student is already actively enrolled in the target course.');
    }

    if (existingTarget?.status === EnrollmentStatus.PENDING) {
      throw new ConflictException('An enrollment in the target course is pending payment.');
    }

    // targetEnrollmentId is declared here and assigned inside the transaction.
    // TypeScript cannot infer that both branches always assign it, so the
    // non-null assertion (!) is used. It is safe because both update and create
    // branches always assign before the transaction completes, and any DB error
    // throws before this variable is used.
    let targetEnrollmentId!: string;
    const carriedExpiry = source.expiryDate;
    const carriedAmount = source.amountPaid;

    // Single database transaction
    await this.prisma.$transaction(async (tx) => {
      // 1. Lock the source student-course pair
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(
          hashtext(${source.studentUserId}::text), 
          hashtext(${source.courseId}::text)
        )
      `;

      // 2. Lock the target student-course pair
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(
          hashtext(${source.studentUserId}::text), 
          hashtext(${dto.targetCourseId}::text)
        )
      `;

      // 3. Re-verify the source status under the safety of our lock
      const currentSource = await tx.enrollment.findUnique({
        where: { id: source.id },
        select: { status: true },
      });

      if (!currentSource || currentSource.status !== EnrollmentStatus.ACTIVE) {
        throw new ConflictException('Only active enrollments can be transferred.');
      }

      // 4. Re-verify the target status under the safety of our lock
      const currentTarget = await tx.enrollment.findUnique({
        where: {
          studentUserId_courseId: {
            studentUserId: source.studentUserId,
            courseId: dto.targetCourseId,
          },
        },
        select: { id: true, status: true },
      });

      if (currentTarget?.status === EnrollmentStatus.ACTIVE) {
        throw new ConflictException('Student is already actively enrolled in the target course.');
      }

      if (currentTarget?.status === EnrollmentStatus.PENDING) {
        throw new ConflictException('An enrollment in the target course is pending payment.');
      }

      // 5. Cancel source
      await tx.enrollment.update({
        where: { id: source.id },
        data: { status: EnrollmentStatus.CANCELLED, amountPaid: new Prisma.Decimal('0.00') },
      });

      // 6. Insert or reactivate target
      if (currentTarget) {
        const updatedTarget = await tx.enrollment.update({
          where: { id: currentTarget.id },
          data: {
            status: EnrollmentStatus.ACTIVE,
            enrolledAt: new Date(),
            expiryDate: carriedExpiry,
            amountPaid: carriedAmount,
          },
          select: { id: true },
        });
        targetEnrollmentId = updatedTarget.id;
      } else {
        const createdTarget = await tx.enrollment.create({
          data: {
            studentUserId: source.studentUserId,
            courseId: dto.targetCourseId,
            status: EnrollmentStatus.ACTIVE,
            amountPaid: carriedAmount,
            expiryDate: carriedExpiry,
          },
          select: { id: true },
        });
        targetEnrollmentId = createdTarget.id;
      }

      // 7. Log audit of transfer (related to source course)
      await tx.courseAuditLog.create({
        data: {
          courseId: source.courseId,
          action: CourseAuditAction.UPDATED,
          performedBy: actorId,
          metadata: {
            type: 'ENROLLMENT_TRANSFERRED_OUT',
            enrollmentId: source.id,
            studentUserId: source.studentUserId,
            targetCourseId: dto.targetCourseId,
            reason: dto.reason,
            amountMoved: carriedAmount.toString(), // Log the movement of money
          },
        },
      });

      // 8. Log audit of transfer (related to target course)
      await tx.courseAuditLog.create({
        data: {
          courseId: dto.targetCourseId,
          action: CourseAuditAction.UPDATED,
          performedBy: actorId,
          metadata: {
            type: 'ENROLLMENT_TRANSFERRED_IN',
            enrollmentId: targetEnrollmentId, // Logged target ID
            studentUserId: source.studentUserId,
            sourceCourseId: source.courseId,
            reason: dto.reason,
            amountMoved: carriedAmount.toString(), // Log the movement of money
          },
        },
      });
    });
    // Fire events outside transaction using the captured target ID
    this.eventEmitter.emit('enrollment.cancelled', {
      studentUserId: source.studentUserId,
      courseId: source.courseId,
      enrollmentId: source.id,
    });
    this.eventEmitter.emit('enrollment.created', {
      studentUserId: source.studentUserId,
      courseId: dto.targetCourseId,
      enrollmentId: targetEnrollmentId,
    });
    return { success: true };
  }

  // ─── GUARD HELPER ─────────────────────────────────────────────────────────────

  /**
   * isEnrolled(userId, courseId)
   *
   * Boolean helper called by EnrollmentGuard to determine whether a student
   * may access a course at this exact moment.
   *
   * Two conditions must both be true:
   *  1. status === ACTIVE
   *  2. expiryDate is null (no expiry) or has not passed yet
   *
   * The expiryDate check is critical — the nightly cron runs at 1am UTC, so
   * there is up to a 24-hour window where an enrollment's expiry date has passed
   * but its status is still ACTIVE in the DB. Without this check, expired students
   * would retain access until the cron fires.
   */
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentUserId_courseId: { studentUserId: userId, courseId } },
      select: { status: true, expiryDate: true },
    });

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) return false;
    if (enrollment.expiryDate && enrollment.expiryDate < new Date()) return false;

    return true;
  }

  // ─── CRON JOB ─────────────────────────────────────────────────────────────────

  /**
   * expireStaleEnrollments()
   *
   * Scheduled task — runs every night at 01:00 UTC.
   * Sweeps all ACTIVE enrollments where expiryDate has passed and marks them EXPIRED.
   * Emits 'enrollment.expired' per affected row so NotificationModule can notify
   * students that their access has lapsed.
   *
   * Execution order matters:
   *  1. findMany first — captures the rows about to be expired while they are
   *     still ACTIVE, so we have studentUserId and courseId for event payloads
   *  2. updateMany second — atomically flips all matching rows to EXPIRED in one query
   *  3. emit per row — fires 'enrollment.expired' for each affected student
   *
   * The order cannot be reversed: if updateMany ran first, the subsequent findMany
   * would query for status=ACTIVE with expiryDate<now and find nothing (those rows
   * are now EXPIRED), resulting in zero events fired.
   *
   * Wrapped in try/catch so a DB failure during the sweep is logged and does not
   * crash the scheduler process.
   */
  @Cron('0 1 * * *')
  async expireStaleEnrollments() {
    this.logger.log('Starting nightly sweep of expired enrollments...');
    const now = new Date();

    try {
      const affected = await this.prisma.enrollment.findMany({
        where: { status: EnrollmentStatus.ACTIVE, expiryDate: { lt: now } },
        select: { id: true, studentUserId: true, courseId: true },
      });

      if (affected.length === 0) {
        this.logger.log('No expired enrollments found.');
        return;
      }

      await this.prisma.enrollment.updateMany({
        where: { status: EnrollmentStatus.ACTIVE, expiryDate: { lt: now } },
        data: { status: EnrollmentStatus.EXPIRED },
      });

      for (const item of affected) {
        this.eventEmitter.emit('enrollment.expired', {
          studentUserId: item.studentUserId,
          courseId: item.courseId,
          enrollmentId: item.id,
        });
      }

      this.logger.log(`Nightly sweep complete. Expired ${affected.length} enrollment(s).`);
    } catch (err) {
      this.logger.error('Failed to expire stale enrollments during cron sweep:', err);
    }
  }

  // ─── EVENT EMITTERS ──────────────────────────────────────────────────────────

  /**
   * 14 — handleEnrollmentCompleted(payload)
   * Listens for 'enrollment.completed' and updates the Enrollment status to COMPLETED.
   */
  @OnEvent('enrollment.completed')
  async handleEnrollmentCompleted(payload: { studentUserId: string; courseId: string }) {
    const { studentUserId, courseId } = payload;
    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentUserId_courseId: { studentUserId: studentUserId, courseId: courseId },
        },
        select: { id: true, status: true },
      });
      if (!enrollment) {
        this.logger.warn(
          `handleEnrollmentCompleted: no enrollment found for studentUserId=${studentUserId}, courseId=${courseId}`,
        );
        return;
      }
      if (enrollment.status === EnrollmentStatus.COMPLETED) {
        return; // Idempotent check
      }
      await this.prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: EnrollmentStatus.COMPLETED },
      });
      this.logger.log(`Enrollment #${enrollment.id} status updated to COMPLETED.`);
    } catch (error) {
      this.logger.error(
        `handleEnrollmentCompleted: failed to update enrollment status for studentUserId=${studentUserId}, courseId=${courseId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  // ─── BOOTSTRAP ──────────────────────────────────────────────────────────

  /**
   * Run a sweep of expired enrollments once at application startup.
   * Ensures database consistency even if the 1:00 AM UTC cron job was missed due to deployment/downtime.
   */
  async onApplicationBootstrap() {
    this.logger.log('Application started. Running sweep of expired enrollments...');

    // Run in the background without blocking the main startup thread
    this.expireStaleEnrollments().catch((err) => {
      this.logger.error('Failed to run startup sweep of expired enrollments:', err);
    });
  }
}
