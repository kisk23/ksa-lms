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
  DiscountType,
  RefundStatus,
  RefundMethod,
  SessionPlatform,
  LiveSessionStatus,
} from '../src/generated/client';

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const Decimal = Prisma.Decimal;

async function main() {
  // ── Production Safeguard ─────────────────────────
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Seeding is disabled in production environments.');
    return;
  }

  console.log('🧹 Cleaning up old database records...');
  // Delete in reverse order of foreign key dependencies to prevent errors
  await prisma.refund.deleteMany();
  await prisma.paymentWebhookEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.promoCodeUsage.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.liveSessionNotification.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.assignmentBestScore.deleteMany();
  await prisma.assignmentAttempt.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.courseAuditLog.deleteMany();
  await prisma.course.deleteMany();
  await prisma.parentStudentLink.deleteMany();
  await prisma.assistantPermission.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Cleanup complete!');

  console.log('🌱 Seeding Sulam LMS development database...');

  // ── Users ────────────────────────────────────────
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      identity: 'superadmin@sulam.sa',
      email: 'superadmin@sulam.sa',
      phone: '+966500000001',
      passwordHash: '$2b$10$iSAPano1Mr0qvQ.3QfVg3eJZs/AUdm31PgIQg1X0K7Gj9gRDnKPyG',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      name: 'Ahmed Al-Harbi',
      identity: 'teacher@sulam.sa',
      email: 'teacher@sulam.sa',
      phone: '+966500000002',
      passwordHash: '$2b$10$pl9R5i3u6o5QWdksLaSiZ.ssvPDJ5UPgGCwf8Osn5C1gygDXhZMA6',
      role: UserRole.TEACHER,
      isVerified: true,
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Omar Al-Qahtani',
      identity: 'student@sulam.sa',
      email: 'student@sulam.sa',
      phone: '+966500000003',
      passwordHash: '$2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.',
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Yousef Al-Otaibi',
      identity: 'student2@sulam.sa',
      email: 'student2@sulam.sa',
      phone: '+966500000005',
      passwordHash: '$2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.',
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Sara Al-Ghamdi',
      identity: 'student3@sulam.sa',
      email: 'student3@sulam.sa',
      phone: '+966500000006',
      passwordHash: '$2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.',
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const parent = await prisma.user.create({
    data: {
      name: 'Khalid Al-Qahtani',
      identity: 'parent@sulam.sa',
      email: 'parent@sulam.sa',
      phone: '+966500000004',
      passwordHash: '$2b$10$jQDO4mk4iPMF4XOB73BxbuNFMjgP0uSt8J55ny2C75lGr99XlI53y',
      role: UserRole.PARENT,
      isVerified: true,
    },
  });

  const assistant = await prisma.user.create({
    data: {
      name: 'Fatimah Al-Zahrani',
      identity: 'assistant@sulam.sa',
      email: 'assistant@sulam.sa',
      phone: '+966500000007',
      passwordHash: '$2b$10$jQDO4mk4iPMF4XOB73BxbuNFMjgP0uSt8J55ny2C75lGr99XlI53y',
      role: UserRole.ASSISTANT_ADMIN,
      isVerified: true,
    },
  });

  // ── Assistant Permissions ────────────────────────
  const permissionsList = [
    'ENROLLMENT_READ',
    'ENROLLMENT_CREATE',
    'ENROLLMENT_UPDATE',
    'ENROLLMENT_DELETE',
  ];
  for (const permission of permissionsList) {
    await prisma.assistantPermission.create({
      data: {
        assistantUserId: assistant.id,
        permission,
        grantedBy: superAdmin.id,
      },
    });
  }

  // ── Parent-Student Link ──────────────────────────
  await prisma.parentStudentLink.create({
    data: {
      parentUserId: parent.id,
      studentUserId: student.id,
      relationship: ParentRelationship.FATHER,
    },
  });

  // ── Course ───────────────────────────────────────
  const course = await prisma.course.create({
    data: {
      teacherUserId: teacher.id,
      slug: 'python-basics',
      title: 'أساسيات البرمجة بلغة بايثون',
      description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون',
      price: new Decimal('199.00'),
      status: CourseStatus.PUBLISHED,
    },
  });

  // ── Chapters ─────────────────────────────────────
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'المقدمة وتهيئة بيئة العمل',
      orderIndex: 1,
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'التحكم في تدفق البرنامج',
      orderIndex: 2,
    },
  });

  // ── Lessons ──────────────────────────────────────
  const lesson1 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: 'مرحبا بالعالم — أول برنامج',
      orderIndex: 1,
      videoUrl: 'dQw4w9WgXcQ',
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: 'المتغيرات وأنواع البيانات',
      orderIndex: 2,
      videoUrl: 'dQw4w9WgXcQ',
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      chapterId: chapter2.id,
      title: 'الشروط والعمليات المنطقية',
      orderIndex: 1,
      videoUrl: 'dQw4w9WgXcQ',
    },
  });

  await prisma.lesson.create({
    data: {
      chapterId: chapter2.id,
      title: 'الحلقات التكرارية (Loops)',
      orderIndex: 2,
      videoUrl: 'dQw4w9WgXcQ',
    },
  });

  // ── Assignments & Questions ──────────────────────
  const assignment1 = await prisma.assignment.create({
    data: {
      lessonId: lesson1.id,
      passingScorePct: 60,
      maxAttempts: 3,
    },
  });

  const question1 = await prisma.question.create({
    data: {
      assignmentId: assignment1.id,
      text: 'ما هي الدالة المستخدمة لطباعة نص في بايثون؟',
      orderIndex: 1,
      options: {
        create: [
          { text: 'print()', isCorrect: true, orderIndex: 1 },
          { text: 'echo()', isCorrect: false, orderIndex: 2 },
          { text: 'write()', isCorrect: false, orderIndex: 3 },
        ],
      },
    },
    include: {
      options: true,
    },
  });

  const question2 = await prisma.question.create({
    data: {
      assignmentId: assignment1.id,
      text: 'كيف تكتب تعليقاً في بايثون؟',
      orderIndex: 2,
      options: {
        create: [
          { text: '# comment', isCorrect: true, orderIndex: 1 },
          { text: '// comment', isCorrect: false, orderIndex: 2 },
          { text: '/* comment */', isCorrect: false, orderIndex: 3 },
        ],
      },
    },
    include: {
      options: true,
    },
  });

  // ── Enrollments, Payments, and Progress ───────────

  // 1. ACTIVE Student (Omar)
  const payment1 = await prisma.payment.create({
    data: {
      payerUserId: student.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student.id,
      courseId: course.id,
      orderId: 'ORDER-OMAR-001',
      originalAmount: new Decimal('199.00'),
      discountAmount: new Decimal('0.00'),
      finalAmount: new Decimal('199.00'),
      amount: 19900,
      currency: 'SAR',
      refundedAmount: 0,
      capturedAmount: 19900,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      idempotencyKey: 'payment-omar-python-basics',
      paidAt: new Date(),
    },
  });

  await prisma.enrollment.create({
    data: {
      studentUserId: student.id,
      courseId: course.id,
      amountPaid: new Decimal('199.00'),
      status: EnrollmentStatus.ACTIVE,
      paymentId: payment1.id,
    },
  });

  await prisma.lessonProgress.createMany({
    data: [
      {
        studentUserId: student.id,
        lessonId: lesson1.id,
        videoWatchedPct: 100,
        isCompleted: true,
        videoCompletedAt: new Date(),
        completedAt: new Date(),
      },
      {
        studentUserId: student.id,
        lessonId: lesson2.id,
        videoWatchedPct: 100,
        isCompleted: true,
        videoCompletedAt: new Date(),
        completedAt: new Date(),
      },
      {
        studentUserId: student.id,
        lessonId: lesson3.id,
        videoWatchedPct: 40,
        isCompleted: false,
      },
    ],
  });

  await prisma.courseProgress.create({
    data: {
      studentUserId: student.id,
      courseId: course.id,
      lastLessonId: lesson3.id,
      completedLessons: 2,
      totalLessons: 4,
      progressPct: 50,
    },
  });

  // Assignment Attempt for Omar
  const attempt = await prisma.assignmentAttempt.create({
    data: {
      studentUserId: student.id,
      assignmentId: assignment1.id,
      attemptNumber: 1,
      scorePct: 100,
      isPassed: true,
      snapshot: [
        {
          questionId: question1.id,
          questionText: question1.text,
          selectedOptionId: question1.options[0].id,
          selectedOptionText: question1.options[0].text,
          isCorrect: true,
        },
        {
          questionId: question2.id,
          questionText: question2.text,
          selectedOptionId: question2.options[0].id,
          selectedOptionText: question2.options[0].text,
          isCorrect: true,
        },
      ] as Prisma.InputJsonValue,
    },
  });

  await prisma.assignmentBestScore.create({
    data: {
      studentUserId: student.id,
      assignmentId: assignment1.id,
      bestScorePct: 100,
      bestAttemptId: attempt.id,
      isPassed: true,
    },
  });

  // 2. EXPIRED Student (Yousef)
  const payment2 = await prisma.payment.create({
    data: {
      payerUserId: student2.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student2.id,
      courseId: course.id,
      orderId: 'ORDER-YOUSEF-001',
      originalAmount: new Decimal('199.00'),
      discountAmount: new Decimal('0.00'),
      finalAmount: new Decimal('199.00'),
      amount: 19900,
      currency: 'SAR',
      refundedAmount: 0,
      capturedAmount: 19900,
      status: PaymentStatus.captured,
      paymentMethod: PaymentMethod.MADA,
      idempotencyKey: 'payment-yousef-python-basics',
      paidAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // Paid 31 days ago
    },
  });

  await prisma.enrollment.create({
    data: {
      studentUserId: student2.id,
      courseId: course.id,
      amountPaid: new Decimal('199.00'),
      status: EnrollmentStatus.EXPIRED,
      paymentId: payment2.id,
      expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired 1 day ago
    },
  });

  await prisma.courseProgress.create({
    data: {
      studentUserId: student2.id,
      courseId: course.id,
      completedLessons: 0,
      totalLessons: 4,
      progressPct: 0,
    },
  });

  // 3. CANCELLED Student (Sara)
  const payment3 = await prisma.payment.create({
    data: {
      payerUserId: student3.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student3.id,
      courseId: course.id,
      orderId: 'ORDER-SARA-001',
      originalAmount: new Decimal('199.00'),
      discountAmount: new Decimal('0.00'),
      finalAmount: new Decimal('199.00'),
      amount: 19900,
      currency: 'SAR',
      refundedAmount: 19900,
      capturedAmount: 19900,
      status: PaymentStatus.refunded,
      paymentMethod: PaymentMethod.APPLE_PAY,
      idempotencyKey: 'payment-sara-python-basics',
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.enrollment.create({
    data: {
      studentUserId: student3.id,
      courseId: course.id,
      amountPaid: new Decimal('0.00'), // Zeroed out on cancellation
      status: EnrollmentStatus.CANCELLED,
      paymentId: payment3.id,
    },
  });

  await prisma.refund.create({
    data: {
      paymentId: payment3.id,
      requestedBy: superAdmin.id,
      refundAmount: new Decimal('199.00'),
      reason: 'Student requested cancellation within refund window.',
      method: RefundMethod.ONLINE,
      status: RefundStatus.PROCESSED,
      processedAt: new Date(),
    },
  });

  // ── Promo Codes ──────────────────────────────────
  await prisma.promoCode.create({
    data: {
      code: 'EID20',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal('20.00'),
      isActive: true,
      createdBy: superAdmin.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.promoCode.create({
    data: {
      code: 'FREEPASS',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal('100.00'),
      isActive: true,
      createdBy: superAdmin.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // ── Live Sessions ────────────────────────────────
  await prisma.liveSession.create({
    data: {
      courseId: course.id,
      teacherUserId: teacher.id,
      title: 'مراجعة الباب الأول والإجابة على الاستفسارات',
      meetingUrl: 'https://zoom.us/j/9876543210',
      platform: SessionPlatform.ZOOM,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In 7 days
      durationMinutes: 60,
      status: LiveSessionStatus.SCHEDULED,
    },
  });

  console.log('✅ Seed Sulam LMS development database completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Gracefully close the pg pool to allow node to exit
  });
