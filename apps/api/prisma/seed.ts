import { PrismaClient, UserRole, ParentRelationship } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Phase 1 Lite database...');

  // ── Users ──────────────────────────────
  // Using 'identity' instead of 'email' per latest schema
  const superAdmin = await prisma.user.upsert({
    where: { identity: 'superadmin@sulam.sa' },
    update: {},
    create: {
      name: 'Super Admin',
      identity: 'superadmin@sulam.sa',
      phone: '+966500000001',
      passwordHash: '$2b$12$placeholder.hash',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { identity: 'teacher@sulam.sa' },
    update: {},
    create: {
      name: 'Ahmed Al-Harbi',
      identity: 'teacher@sulam.sa',
      phone: '+966500000002',
      passwordHash: '$2b$12$placeholder.hash',
      role: UserRole.TEACHER,
      isVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { identity: 'student@sulam.sa' },
    update: {},
    create: {
      name: 'Omar Al-Qahtani',
      identity: 'student@sulam.sa',
      phone: '+966500000003',
      passwordHash: '$2b$12$placeholder.hash',
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });

  const parent = await prisma.user.upsert({
    where: { identity: 'parent@sulam.sa' },
    update: {},
    create: {
      name: 'Khalid Al-Qahtani',
      identity: 'parent@sulam.sa',
      phone: '+966500000004',
      passwordHash: '$2b$12$placeholder.hash',
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
  const course = await prisma.course.create({
    data: {
      teacherUserId: teacher.id,
      title: 'أساسيات البرمجة بلغة بايثون',
      description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون',
      price: new Decimal('199.00'),
      isPublished: true,
    },
  });

  // ── Chapter ────────────────────────────
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'المقدمة وتهيئة بيئة العمل',
      orderIndex: 1,
    },
  });

  // ── Lessons (videoXp removed/commented out in schema) ──
  const lesson1 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: 'مرحبا بالعالم — أول برنامج',
      orderIndex: 1,
      youtubeVideoId: 'dQw4w9WgXcQ',
      // videoXp: 10, // Removed for Phase 1
    },
  });

  // ── Assignment (Passing Score remains, xpValue and shuffle removed) ──
  const assignment = await prisma.assignment.create({
    data: {
      lessonId: lesson1.id,
      passingScorePct: 60,
      maxAttempts: 3,
      // xpValue: 20, // Removed for Phase 1
      // shuffleQuestions: true, // Removed for Phase 1
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
  await prisma.enrollment.create({
    data: {
      studentUserId: student.id,
      courseId: course.id,
      amountPaid: new Decimal('199.00'),
    },
  });

  console.log('✅ Seed Phase 1 Lite completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
