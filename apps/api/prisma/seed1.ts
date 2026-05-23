//anwar seed for users and courses
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
} from '../src/generated/client';

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const Decimal = Prisma.Decimal;

// Passwords (bcrypt round 10):
//   superadmin@sulam.sa  →  Admin@1234
//   teacher@sulam.sa     →  Teacher@1234
//   student@sulam.sa     →  Student@1234
//   parent@sulam.sa      →  Parent@1234

async function main() {
  console.log('🌱 Seeding Phase 1 Lite database...');

  // ── Users ──────────────────────────────
  await prisma.user.upsert({
    where: { identity: 'superadmin@sulam.sa' },
    update: {
      passwordHash: '$2b$10$iSAPano1Mr0qvQ.3QfVg3eJZs/AUdm31PgIQg1X0K7Gj9gRDnKPyG',
      isVerified: true,
    },
    create: {
      name: 'Super Admin',
      identity: 'superadmin@sulam.sa',
      email: 'superadmin@sulam.sa',
      phone: '+966500000001',
      passwordHash: '$2b$10$iSAPano1Mr0qvQ.3QfVg3eJZs/AUdm31PgIQg1X0K7Gj9gRDnKPyG',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { identity: 'teacher@sulam.sa' },
    update: {
      passwordHash: '$2b$10$pl9R5i3u6o5QWdksLaSiZ.ssvPDJ5UPgGCwf8Osn5C1gygDXhZMA6',
      isVerified: true,
    },
    create: {
      name: 'Ahmed Al-Harbi',
      identity: 'teacher@sulam.sa',
      email: 'teacher@sulam.sa',
      phone: '+966500000002',
      passwordHash: '$2b$10$pl9R5i3u6o5QWdksLaSiZ.ssvPDJ5UPgGCwf8Osn5C1gygDXhZMA6',
      role: UserRole.TEACHER,
      isVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { identity: 'student@sulam.sa' },
    update: {
      passwordHash: '$2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.',
      isVerified: true,
    },
    create: {
      name: 'Omar Al-Qahtani',
      identity: 'student@sulam.sa',
      email: 'student@sulam.sa',
      phone: '+966500000003',
      passwordHash: '$2b$10$X6m1999B9qUNm5UiZcSwAeHZ/bcSGzZQywx/PMH0vuHd5ueS4ppl.',
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const parent = await prisma.user.upsert({
    where: { identity: 'parent@sulam.sa' },
    update: {
      passwordHash: '$2b$10$jQDO4mk4iPMF4XOB73BxbuNFMjgP0uSt8J55ny2C75lGr99XlI53y',
      isVerified: true,
    },
    create: {
      name: 'Khalid Al-Qahtani',
      identity: 'parent@sulam.sa',
      email: 'parent@sulam.sa',
      phone: '+966500000004',
      passwordHash: '$2b$10$jQDO4mk4iPMF4XOB73BxbuNFMjgP0uSt8J55ny2C75lGr99XlI53y',
      role: UserRole.PARENT,
      isVerified: true,
    },
  });

  // ── Parent-Student Link ────────────────
  await prisma.parentStudentLink.upsert({
    where: {
      parentUserId_studentUserId_relationship: {
        parentUserId: parent.id,
        studentUserId: student.id,
        relationship: ParentRelationship.FATHER,
      },
    },
    update: {},
    create: {
      parentUserId: parent.id,
      studentUserId: student.id,
      relationship: ParentRelationship.FATHER,
    },
  });

  // ── Course ─────────────────────────────
  const course = await prisma.course.upsert({
    where: { slug: 'python-basics' },
    update: {},
    create: {
      teacherUserId: teacher.id,
      slug: 'python-basics',
      title: 'أساسيات البرمجة بلغة بايثون',
      description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون',
      price: new Decimal('199.00'),
      status: CourseStatus.PUBLISHED,
    },
  });

  // ── Chapter ────────────────────────────
  const chapter1 = await prisma.chapter.upsert({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 1,
      },
    },
    update: {},
    create: {
      courseId: course.id,
      title: 'المقدمة وتهيئة بيئة العمل',
      orderIndex: 1,
    },
  });

  // ── Lessons ────────────────────────────
  const lesson1 = await prisma.lesson.upsert({
    where: {
      chapterId_orderIndex: {
        chapterId: chapter1.id,
        orderIndex: 1,
      },
    },
    update: {},
    create: {
      chapterId: chapter1.id,
      title: 'مرحبا بالعالم — أول برنامج',
      orderIndex: 1,
    },
  });

  // ── Assignment ─────────────────────────
  const assignment = await prisma.assignment.upsert({
    where: { lessonId: lesson1.id },
    update: {},
    create: {
      lessonId: lesson1.id,
      passingScorePct: 60,
      maxAttempts: 3,
    },
  });

  // ── Questions + Options ────────────────
  await prisma.question.create({
    data: {
      assignmentId: assignment.id,
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
  });

  // ── Enrollment ─────────────────────────
  await prisma.enrollment.upsert({
    where: {
      studentUserId_courseId: {
        studentUserId: student.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      studentUserId: student.id,
      courseId: course.id,
      amountPaid: new Decimal('199.00'),
      status: EnrollmentStatus.ACTIVE,
    },
  });

  // ── Payment ────────────────────────────
  await prisma.payment.upsert({
    where: { idempotencyKey: 'seed-moyasar-payment-python-basics' },
    update: {},
    create: {
      payerUserId: student.id,
      initiatorRole: PaymentInitiatorRole.STUDENT,
      studentUserId: student.id,
      courseId: course.id,
      orderId: 'SEED-ORDER-001',
      originalAmount: new Decimal('199.00'),
      discountAmount: new Decimal('0.00'),
      finalAmount: new Decimal('199.00'),
      amount: 19900,
      currency: 'SAR',
      refundedAmount: 0,
      capturedAmount: 0,
      status: PaymentStatus.initiated,
      idempotencyKey: 'seed-moyasar-payment-python-basics',
      metadata: { seed: true },
      rawGatewayResponse: { source: 'seed' },
    },
  });

  console.log('✅ Seed Phase 1 Lite completed!');
  console.log('');
  console.log('📋 Login credentials:');
  console.log('   superadmin@sulam.sa  /  Admin@1234');
  console.log('   teacher@sulam.sa     /  Teacher@1234');
  console.log('   student@sulam.sa     /  Student@1234');
  console.log('   parent@sulam.sa      /  Parent@1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
