// Comprehensive seed file to test the payment module and frontend workflows
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import {
  PrismaClient,
  UserRole,
  ParentRelationship,
  Prisma,
  CourseStatus,
  EnrollmentStatus,
  PaymentInitiatorRole,
  PaymentStatus,
  PaymentMethod,
  RefundStatus,
  RefundMethod,
  DiscountType,
} from '../src/generated/client';

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const Decimal = Prisma.Decimal;

// Passwords (bcrypt round 10):
//   Admin@1234   →  $2b$10$iSAPano1Mr0qvQ.3QfVg3eJZs/AUdm31PgIQg1X0K7Gj9gRDnKPyG
//   Teacher@1234 →  $2b$10$pl9R5i3u6o5QWdksLaSiZ.ssvPDJ5UPgGCwf8Osn5C1gygDXhZMA6
//   Student@1234 →  $2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.
//   Parent@1234  →  $2b$10$jQDO4mk4iPMF4XOB73BxbuNFMjgP0uSt8J55ny2C75lGr99XlI53y

const passSuperAdmin = '$2b$10$iSAPano1Mr0qvQ.3QfVg3eJZs/AUdm31PgIQg1X0K7Gj9gRDnKPyG';
const passTeacher = '$2b$10$pl9R5i3u6o5QWdksLaSiZ.ssvPDJ5UPgGCwf8Osn5C1gygDXhZMA6';
const passStudent = '$2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.';
const passParent = '$2b$10$jQDO4mk4iPMF4XOB73BxbuNFMjgP0uSt8J55ny2C75lGr99XlI53y';

async function main() {
  console.log('🌱 Seeding payments and related data...');

  // 1. Seed Users (Admins, Teachers, Students, Parents)
  const superAdmin = await prisma.user.upsert({
    where: { identity: 'superadmin@sulam.sa' },
    update: { passwordHash: passSuperAdmin, isVerified: true },
    create: {
      name: 'Super Admin',
      identity: 'superadmin@sulam.sa',
      email: 'superadmin@sulam.sa',
      phone: '+966500000001',
      passwordHash: passSuperAdmin,
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });

  const teacher1 = await prisma.user.upsert({
    where: { identity: 'teacher@sulam.sa' },
    update: { passwordHash: passTeacher, isVerified: true },
    create: {
      name: 'Ahmed Al-Harbi',
      identity: 'teacher@sulam.sa',
      email: 'teacher@sulam.sa',
      phone: '+966500000002',
      passwordHash: passTeacher,
      role: UserRole.TEACHER,
      isVerified: true,
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { identity: 'teacher2@sulam.sa' },
    update: { passwordHash: passTeacher, isVerified: true },
    create: {
      name: 'Fatima Al-Sudais',
      identity: 'teacher2@sulam.sa',
      email: 'teacher2@sulam.sa',
      phone: '+966500000022',
      passwordHash: passTeacher,
      role: UserRole.TEACHER,
      isVerified: true,
    },
  });

  const student1 = await prisma.user.upsert({
    where: { identity: 'student@sulam.sa' },
    update: { passwordHash: passStudent, isVerified: true },
    create: {
      name: 'Omar Al-Qahtani',
      identity: 'student@sulam.sa',
      email: 'student@sulam.sa',
      phone: '+966500000003',
      passwordHash: passStudent,
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { identity: 'student2@sulam.sa' },
    update: { passwordHash: passStudent, isVerified: true },
    create: {
      name: 'Ali Al-Ghamdi',
      identity: 'student2@sulam.sa',
      email: 'student2@sulam.sa',
      phone: '+966500000031',
      passwordHash: passStudent,
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { identity: 'student3@sulam.sa' },
    update: { passwordHash: passStudent, isVerified: true },
    create: {
      name: 'Reem Al-Faisal',
      identity: 'student3@sulam.sa',
      email: 'student3@sulam.sa',
      phone: '+966500000032',
      passwordHash: passStudent,
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const student4 = await prisma.user.upsert({
    where: { identity: 'student4@sulam.sa' },
    update: { passwordHash: passStudent, isVerified: true },
    create: {
      name: 'Yousef Al-Malki',
      identity: 'student4@sulam.sa',
      email: 'student4@sulam.sa',
      phone: '+966500000033',
      passwordHash: passStudent,
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const parent = await prisma.user.upsert({
    where: { identity: 'parent@sulam.sa' },
    update: { passwordHash: passParent, isVerified: true },
    create: {
      name: 'Khalid Al-Qahtani',
      identity: 'parent@sulam.sa',
      email: 'parent@sulam.sa',
      phone: '+966500000004',
      passwordHash: passParent,
      role: UserRole.PARENT,
      isVerified: true,
    },
  });

  // Parent-student link for testing parent checkout flows
  await prisma.parentStudentLink.upsert({
    where: {
      parentUserId_studentUserId_relationship: {
        parentUserId: parent.id,
        studentUserId: student1.id,
        relationship: ParentRelationship.FATHER,
      },
    },
    update: {},
    create: {
      parentUserId: parent.id,
      studentUserId: student1.id,
      relationship: ParentRelationship.FATHER,
    },
  });

  // 2. Seed Courses
  const coursePython = await prisma.course.upsert({
    where: { slug: 'python-basics' },
    update: {},
    create: {
      teacherUserId: teacher1.id,
      slug: 'python-basics',
      title: 'أساسيات البرمجة بلغة بايثون',
      description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون',
      price: new Decimal('199.00'),
      status: CourseStatus.PUBLISHED,
    },
  });

  const courseReact = await prisma.course.upsert({
    where: { slug: 'react-advanced' },
    update: {},
    create: {
      teacherUserId: teacher2.id,
      slug: 'react-advanced',
      title: 'مستوى متقدم في مكتبة React',
      description: 'دورة كاملة للمطورين المحترفين في رياكت',
      price: new Decimal('299.00'),
      status: CourseStatus.PUBLISHED,
    },
  });

  const courseNextJS = await prisma.course.upsert({
    where: { slug: 'nextjs-fullstack' },
    update: {},
    create: {
      teacherUserId: teacher1.id,
      slug: 'nextjs-fullstack',
      title: 'بناء تطبيقات متكاملة باستخدام Next.js',
      description: 'تعلم بناء تطبيقات ويب حديثة من البداية وحتى النشر',
      price: new Decimal('499.00'),
      status: CourseStatus.PUBLISHED,
    },
  });

  await prisma.course.upsert({
    where: { slug: 'free-intro' },
    update: {},
    create: {
      teacherUserId: teacher2.id,
      slug: 'free-intro',
      title: 'مقدمة مجانية في البرمجة والذكاء الاصطناعي',
      description: 'أساسيات ومفاهيم عامة لدخول عالم التقنية',
      price: new Decimal('0.00'),
      status: CourseStatus.PUBLISHED,
    },
  });

  // 3. Seed Promo Codes
  const promoWelcome = await prisma.promoCode.upsert({
    where: { code: 'WELCOME10' },
    update: { isActive: true },
    create: {
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal('10.00'),
      maxUses: 100,
      isActive: true,
      createdBy: superAdmin.id,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
  });

  const promoSAR50 = await prisma.promoCode.upsert({
    where: { code: 'SAR50' },
    update: { isActive: true },
    create: {
      code: 'SAR50',
      discountType: DiscountType.FIXED,
      discountValue: new Decimal('50.00'),
      maxUses: 50,
      isActive: true,
      createdBy: superAdmin.id,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
  });

  await prisma.promoCode.upsert({
    where: { code: 'FREEPASS' },
    update: { isActive: true },
    create: {
      code: 'FREEPASS',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal('100.00'),
      maxUses: 10,
      isActive: true,
      createdBy: superAdmin.id,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
  });

  await prisma.promoCode.upsert({
    where: { code: 'EXPIRED20' },
    update: { isActive: true },
    create: {
      code: 'EXPIRED20',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal('20.00'),
      isActive: true,
      expiresAt: new Date('2026-03-01T00:00:00Z'),
      createdBy: superAdmin.id,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
  });

  await prisma.promoCode.upsert({
    where: { code: 'DRAFT30' },
    update: { isActive: false },
    create: {
      code: 'DRAFT30',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal('30.00'),
      isActive: false,
      createdBy: superAdmin.id,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
  });

  // 4. Seed Payments & Webhooks & Enrollments (Spread over Jan - May 2026)
  // Clear existing payments/enrollments to avoid unique constraint collisions
  console.log('🧹 Clearing old payments and enrollments to prevent seed conflicts...');
  await prisma.promoCodeUsage.deleteMany({});
  await prisma.paymentWebhookEvent.deleteMany({});
  await prisma.refund.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.payment.deleteMany({});

  const paymentsToSeed = [
    // --- JANUARY 2026 ---
    {
      id: 'd0010001-c000-0000-0000-000000000001',
      orderId: 'ORDER-202601-01',
      payerUserId: student3.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student3.id,
      courseId: courseReact.id,
      originalAmount: 299.0,
      discountAmount: 0.0,
      finalAmount: 299.0,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      moyasarPaymentId: 'pay_react_jan_1',
      moyasarStatus: 'captured',
      capturedAmount: 29900,
      refundedAmount: 0,
      createdAt: new Date('2026-01-10T14:30:00Z'),
      paidAt: new Date('2026-01-10T14:31:00Z'),
    },
    {
      id: 'd0010001-c000-0000-0000-000000000002',
      orderId: 'ORDER-202601-02',
      payerUserId: student2.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student2.id,
      courseId: coursePython.id,
      originalAmount: 199.0,
      discountAmount: 19.9, // WELCOME10 code applied
      finalAmount: 179.1,
      promoCodeId: promoWelcome.id,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.MADA,
      moyasarPaymentId: 'pay_py_jan_2',
      moyasarStatus: 'captured',
      capturedAmount: 17910,
      refundedAmount: 0,
      createdAt: new Date('2026-01-25T09:15:00Z'),
      paidAt: new Date('2026-01-25T09:16:30Z'),
    },

    // --- FEBRUARY 2026 ---
    {
      id: 'd0010001-c000-0000-0000-000000000003',
      orderId: 'ORDER-202602-01',
      payerUserId: student1.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student1.id,
      courseId: courseReact.id,
      originalAmount: 299.0,
      discountAmount: 0.0,
      finalAmount: 299.0,
      status: PaymentStatus.paid,
      paymentMethod: PaymentMethod.APPLE_PAY,
      moyasarPaymentId: 'pay_react_feb_1',
      moyasarStatus: 'paid',
      capturedAmount: 0,
      refundedAmount: 0,
      createdAt: new Date('2026-02-05T18:40:00Z'),
      paidAt: new Date('2026-02-05T18:42:00Z'),
    },
    {
      id: 'd0010001-c000-0000-0000-000000000004',
      orderId: 'ORDER-202602-02',
      payerUserId: parent.id, // Parent pays for student2
      initiatorRole: PaymentInitiatorRole.PARENT,
      studentUserId: student2.id,
      courseId: courseReact.id,
      originalAmount: 299.0,
      discountAmount: 50.0, // SAR50 discount
      finalAmount: 249.0,
      promoCodeId: promoSAR50.id,
      status: PaymentStatus.refunded,
      paymentMethod: PaymentMethod.MADA,
      moyasarPaymentId: 'pay_react_feb_2',
      moyasarStatus: 'refunded',
      capturedAmount: 24900,
      refundedAmount: 24900,
      createdAt: new Date('2026-02-18T11:20:00Z'),
      paidAt: new Date('2026-02-18T11:22:15Z'),
    },

    // --- MARCH 2026 ---
    {
      id: 'd0010001-c000-0000-0000-000000000005',
      orderId: 'ORDER-202603-01',
      payerUserId: student4.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student4.id,
      courseId: courseNextJS.id,
      originalAmount: 499.0,
      discountAmount: 0.0,
      finalAmount: 499.0,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      moyasarPaymentId: 'pay_next_mar_1',
      moyasarStatus: 'captured',
      capturedAmount: 49900,
      refundedAmount: 0,
      createdAt: new Date('2026-03-03T16:00:00Z'),
      paidAt: new Date('2026-03-03T16:02:00Z'),
    },
    {
      id: 'd0010001-c000-0000-0000-000000000006',
      orderId: 'ORDER-202603-02',
      payerUserId: student1.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student1.id,
      courseId: courseNextJS.id,
      originalAmount: 499.0,
      discountAmount: 0.0,
      finalAmount: 499.0,
      status: PaymentStatus.failed,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      moyasarPaymentId: 'pay_next_mar_2',
      moyasarStatus: 'failed',
      capturedAmount: 0,
      refundedAmount: 0,
      createdAt: new Date('2026-03-22T19:45:00Z'),
      failedAt: new Date('2026-03-22T19:46:12Z'),
    },

    // --- APRIL 2026 ---
    {
      id: 'd0010001-c000-0000-0000-000000000007',
      orderId: 'ORDER-202604-01',
      payerUserId: student2.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student2.id,
      courseId: courseReact.id,
      originalAmount: 299.0,
      discountAmount: 0.0,
      finalAmount: 299.0,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.APPLE_PAY,
      moyasarPaymentId: 'pay_react_apr_1',
      moyasarStatus: 'captured',
      capturedAmount: 29900,
      refundedAmount: 0,
      createdAt: new Date('2026-04-12T08:30:00Z'),
      paidAt: new Date('2026-04-12T08:32:00Z'),
    },
    {
      id: 'd0010001-c000-0000-0000-000000000008',
      orderId: 'ORDER-202604-02',
      payerUserId: student3.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student3.id,
      courseId: coursePython.id,
      originalAmount: 199.0,
      discountAmount: 0.0,
      finalAmount: 199.0,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.MADA,
      moyasarPaymentId: 'pay_py_apr_2',
      moyasarStatus: 'captured',
      capturedAmount: 19900,
      refundedAmount: 0,
      createdAt: new Date('2026-04-20T13:10:00Z'),
      paidAt: new Date('2026-04-20T13:11:45Z'),
    },

    // --- MAY 2026 ---
    {
      id: 'd0010001-c000-0000-0000-000000000009',
      orderId: 'ORDER-202605-01',
      payerUserId: student1.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student1.id,
      courseId: coursePython.id,
      originalAmount: 199.0,
      discountAmount: 0.0,
      finalAmount: 199.0,
      status: PaymentStatus.paid,
      paymentMethod: PaymentMethod.MADA,
      moyasarPaymentId: 'pay_py_may_1',
      moyasarStatus: 'paid',
      capturedAmount: 0,
      refundedAmount: 0,
      createdAt: new Date('2026-05-10T10:00:00Z'),
      paidAt: new Date('2026-05-10T10:02:00Z'),
    },
    {
      id: 'd0010001-c000-0000-0000-000000000010',
      orderId: 'ORDER-202605-02',
      payerUserId: student4.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student4.id,
      courseId: courseReact.id,
      originalAmount: 299.0,
      discountAmount: 0.0,
      finalAmount: 299.0,
      status: PaymentStatus.initiated,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      moyasarPaymentId: 'pay_react_may_2_pending',
      moyasarStatus: 'initiated',
      capturedAmount: 0,
      refundedAmount: 0,
      createdAt: new Date('2026-05-22T21:40:00Z'),
    },
    {
      id: 'd0010001-c000-0000-0000-000000000011',
      orderId: 'ORDER-202605-03',
      payerUserId: student3.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student3.id,
      courseId: courseNextJS.id,
      originalAmount: 499.0,
      discountAmount: 49.9, // WELCOME10 code applied
      finalAmount: 449.1,
      promoCodeId: promoWelcome.id,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.OFFLINE, // Offline manual enrollment
      moyasarPaymentId: null,
      moyasarStatus: null,
      capturedAmount: 44910,
      refundedAmount: 0,
      createdAt: new Date('2026-05-23T15:30:00Z'),
      paidAt: new Date('2026-05-23T15:30:00Z'),
    },
  ];

  for (const p of paymentsToSeed) {
    const amountInHalalas = Math.round(p.finalAmount * 100);

    const payment = await prisma.payment.create({
      data: {
        id: p.id,
        orderId: p.orderId,
        payerUserId: p.payerUserId,
        initiatorRole: p.initiatorRole,
        studentUserId: p.studentUserId,
        courseId: p.courseId,
        originalAmount: new Decimal(p.originalAmount),
        discountAmount: new Decimal(p.discountAmount),
        finalAmount: new Decimal(p.finalAmount),
        amount: amountInHalalas,
        currency: 'SAR',
        status: p.status,
        paymentMethod: p.paymentMethod,
        moyasarPaymentId: p.moyasarPaymentId,
        moyasarStatus: p.moyasarStatus,
        capturedAmount: p.capturedAmount,
        refundedAmount: p.refundedAmount,
        idempotencyKey: `idempotency-${p.orderId}`,
        paidAt: p.paidAt,
        failedAt: p.failedAt,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        metadata: {
          channel: p.paymentMethod === PaymentMethod.OFFLINE ? 'admin' : 'web',
          seed: 'true',
        },
        rawGatewayResponse: p.moyasarPaymentId
          ? {
              id: p.moyasarPaymentId,
              status: p.moyasarStatus,
              amount: amountInHalalas,
              currency: 'SAR',
              description: `Order ${p.orderId}`,
              source: {
                type: 'creditcard',
                company: p.paymentMethod === PaymentMethod.MADA ? 'mada' : 'visa',
                name: 'LMS Seed User',
                number: 'XXXX-XXXX-XXXX-1111',
              },
            }
          : Prisma.DbNull,
      },
    });

    // Seed corresponding Enrollment if the payment succeeded (paid, captured, refunded)
    const activeEnrollmentStatuses: PaymentStatus[] = [
      PaymentStatus.paid,
      PaymentStatus.captured,
      PaymentStatus.refunded,
    ];
    if (activeEnrollmentStatuses.includes(p.status)) {
      const enrollmentStatus =
        p.status === PaymentStatus.refunded ? EnrollmentStatus.CANCELLED : EnrollmentStatus.ACTIVE;
      await prisma.enrollment.upsert({
        where: {
          studentUserId_courseId: {
            studentUserId: p.studentUserId,
            courseId: p.courseId,
          },
        },
        update: {
          paymentId: payment.id,
          amountPaid: new Decimal(p.finalAmount),
          status: enrollmentStatus,
          enrolledAt: p.createdAt,
        },
        create: {
          studentUserId: p.studentUserId,
          courseId: p.courseId,
          paymentId: payment.id,
          amountPaid: new Decimal(p.finalAmount),
          status: enrollmentStatus,
          enrolledAt: p.createdAt,
        },
      });
    }

    // Seed Promo Code Usage records where promo code is used
    if (p.promoCodeId) {
      await prisma.promoCodeUsage.create({
        data: {
          promoCodeId: p.promoCodeId,
          studentUserId: p.studentUserId,
          periodVersion: 1,
          usedAt: p.createdAt,
        },
      });
      // Increment usedCount
      await prisma.promoCode.update({
        where: { id: p.promoCodeId },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  // 5. Seed Refunds
  // Online Processed Refund (for the refunded payment ORDER-202602-02)
  const refundedPayment = await prisma.payment.findFirst({
    where: { orderId: 'ORDER-202602-02' },
  });
  if (refundedPayment) {
    await prisma.refund.create({
      data: {
        paymentId: refundedPayment.id,
        requestedBy: superAdmin.id,
        refundAmount: new Decimal('249.00'),
        currency: 'SAR',
        reason: 'Requested by customer due to double booking',
        method: RefundMethod.ONLINE,
        status: RefundStatus.PROCESSED,
        moyasarRefundId: 'ref_react_feb_2',
        processedAt: new Date('2026-02-19T10:00:00Z'),
        createdAt: new Date('2026-02-18T15:00:00Z'),
      },
    });
  }

  // Pending Refund Request to test admin dashboard approvals (for ORDER-202604-01 React Advanced)
  const pendingRefundPayment = await prisma.payment.findFirst({
    where: { orderId: 'ORDER-202604-01' },
  });
  if (pendingRefundPayment) {
    await prisma.refund.create({
      data: {
        paymentId: pendingRefundPayment.id,
        requestedBy: superAdmin.id,
        refundAmount: new Decimal('299.00'),
        currency: 'SAR',
        reason: 'Duplicate course payment',
        method: RefundMethod.ONLINE,
        status: RefundStatus.PENDING,
        createdAt: new Date('2026-04-14T12:00:00Z'),
      },
    });
  }

  // 6. Seed Webhook Events to fill the logs
  const webhookEvents = [
    {
      eventId: 'evt_paid_1',
      moyasarPaymentId: 'pay_py_may_1',
      eventType: 'payment.paid',
      payload: {
        id: 'pay_py_may_1',
        status: 'paid',
        amount: 19900,
        description: 'Order ORDER-202605-01',
      },
      processedAt: new Date('2026-05-10T10:02:10Z'),
    },
    {
      eventId: 'evt_captured_1',
      moyasarPaymentId: 'pay_react_apr_1',
      eventType: 'payment.captured',
      payload: {
        id: 'pay_react_apr_1',
        status: 'captured',
        amount: 29900,
        description: 'Order ORDER-202604-01',
      },
      processedAt: new Date('2026-04-12T08:32:15Z'),
    },
    {
      eventId: 'evt_failed_1',
      moyasarPaymentId: 'pay_next_mar_2',
      eventType: 'payment.failed',
      payload: {
        id: 'pay_next_mar_2',
        status: 'failed',
        amount: 49900,
        description: 'Order ORDER-202603-02',
      },
      processedAt: new Date('2026-03-22T19:46:12Z'),
    },
    {
      eventId: 'evt_refunded_1',
      moyasarPaymentId: 'pay_react_feb_2',
      eventType: 'payment.refunded',
      payload: {
        id: 'pay_react_feb_2',
        status: 'refunded',
        amount: 24900,
        description: 'Order ORDER-202602-02',
      },
      processedAt: new Date('2026-02-18T15:30:00Z'),
    },
  ];

  for (const event of webhookEvents) {
    const payment = event.moyasarPaymentId
      ? await prisma.payment.findUnique({ where: { moyasarPaymentId: event.moyasarPaymentId } })
      : null;

    await prisma.paymentWebhookEvent.create({
      data: {
        eventId: event.eventId,
        paymentId: payment?.id ?? null,
        moyasarPaymentId: event.moyasarPaymentId,
        eventType: event.eventType,
        payload: event.payload as Prisma.InputJsonValue,
        processedAt: event.processedAt,
      },
    });
  }

  console.log('✅ Seeding payments data completed successfully!');
  console.log('📋 Real-world billing data seeded for testing.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
