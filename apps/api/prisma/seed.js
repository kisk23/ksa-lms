'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
require('dotenv/config');
const adapter_pg_1 = require('@prisma/adapter-pg');
const pg_1 = __importDefault(require('pg'));
const client_1 = require('../src/generated/client');
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.default.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const Decimal = client_1.Prisma.Decimal;
async function main() {
  console.log('🌱 Seeding Phase 1 Lite database...');
  await prisma.user.upsert({
    where: { identity: 'superadmin@sulam.sa' },
    update: {},
    create: {
      name: 'Super Admin',
      identity: 'superadmin@sulam.sa',
      email: 'superadmin@sulam.sa',
      phone: '+966500000001',
      passwordHash: '$2b$12$placeholder.hash',
      role: client_1.UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });
  const teacher = await prisma.user.upsert({
    where: { identity: 'teacher@sulam.sa' },
    update: {},
    create: {
      name: 'Ahmed Al-Harbi',
      identity: 'teacher@sulam.sa',
      email: 'teacher@sulam.sa',
      phone: '+966500000002',
      passwordHash: '$2b$12$placeholder.hash',
      role: client_1.UserRole.TEACHER,
      isVerified: true,
    },
  });
  const student = await prisma.user.upsert({
    where: { identity: 'student@sulam.sa' },
    update: {},
    create: {
      name: 'Omar Al-Qahtani',
      identity: 'student@sulam.sa',
      email: 'student@sulam.sa',
      phone: '+966500000003',
      passwordHash: '$2b$12$placeholder.hash',
      role: client_1.UserRole.STUDENT,
      isVerified: true,
    },
  });
  const parent = await prisma.user.upsert({
    where: { identity: 'parent@sulam.sa' },
    update: {},
    create: {
      name: 'Khalid Al-Qahtani',
      identity: 'parent@sulam.sa',
      email: 'parent@sulam.sa',
      phone: '+966500000004',
      passwordHash: '$2b$12$placeholder.hash',
      role: client_1.UserRole.PARENT,
      isVerified: true,
    },
  });
  await prisma.parentStudentLink.upsert({
    where: {
      parentUserId_studentUserId_relationship: {
        parentUserId: parent.id,
        studentUserId: student.id,
        relationship: client_1.ParentRelationship.FATHER,
      },
    },
    update: {},
    create: {
      parentUserId: parent.id,
      studentUserId: student.id,
      relationship: client_1.ParentRelationship.FATHER,
    },
  });
  const course = await prisma.course.upsert({
    where: { slug: 'python-basics' },
    update: {},
    create: {
      teacherUserId: teacher.id,
      slug: 'python-basics',
      title: 'أساسيات البرمجة بلغة بايثون',
      description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون',
      price: new Decimal('199.00'),
      status: client_1.CourseStatus.PUBLISHED,
    },
  });
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
      youtubeVideoId: 'dQw4w9WgXcQ',
    },
  });
  const assignment = await prisma.assignment.upsert({
    where: { lessonId: lesson1.id },
    update: {},
    create: {
      lessonId: lesson1.id,
      passingScorePct: 60,
      maxAttempts: 3,
    },
  });
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
      status: client_1.EnrollmentStatus.ACTIVE,
    },
  });
  console.log('✅ Seed Phase 1 Lite completed!');
  await prisma.payment.upsert({
    where: { idempotencyKey: 'seed-moyasar-payment-python-basics' },
    update: {},
    create: {
      payerUserId: student.id,
      initiatorRole: client_1.PaymentInitiatorRole.STUDENT,
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
      status: client_1.PaymentStatus.initiated,
      idempotencyKey: 'seed-moyasar-payment-python-basics',
      metadata: { seed: true },
      rawGatewayResponse: { source: 'seed' },
    },
  });
}
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
//# sourceMappingURL=seed.js.map
