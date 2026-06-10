import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import {
  PrismaClient,
  UserRole,
  Prisma,
  CourseStatus,
  RequestType,
  ApprovalStatus,
} from '../src/generated/client';

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const Decimal = Prisma.Decimal;

async function main() {
  console.log('🌱 Seeding approvals and related data...');

  // 1. Ensure Super Admin and Teacher users exist
  const superAdmin = await prisma.user.upsert({
    where: { identity: 'superadmin@sulam.sa' },
    update: {},
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
    update: {},
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

  // 2. Clean up old approval requests specifically to allow clean re-running
  console.log('🧹 Cleaning up old approval requests...');
  await prisma.approvalRequest.deleteMany({});

  // Note: we don't delete courses/lessons to avoid breaking existing progress/payments data,
  // but we will create/upsert specific courses for our approval requests.

  // 3. Upsert courses representing different states
  // Course 1: Intro to JavaScript (Draft -> Pending Approval)
  const courseJS = await prisma.course.upsert({
    where: { slug: 'javascript-intro' },
    update: { status: CourseStatus.PENDING_REVIEW },
    create: {
      teacherUserId: teacher.id,
      slug: 'javascript-intro',
      title: 'مقدمة في لغة JavaScript',
      description: 'تعلم لغة البرمجة الأكثر استخداماً لتطوير الويب من الصفر.',
      price: new Decimal('149.00'),
      status: CourseStatus.PENDING_REVIEW,
      thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=400',
    },
  });

  // Course 2: Advanced Python (Published -> Approved previously)
  const coursePython = await prisma.course.upsert({
    where: { slug: 'advanced-python' },
    update: { status: CourseStatus.PUBLISHED },
    create: {
      teacherUserId: teacher.id,
      slug: 'advanced-python',
      title: 'مستوى متقدم في بايثون',
      description: 'مواضيع متقدمة مثل البرمجة المتزامنة، الميتا-برمجة، وتطوير الأدوات.',
      price: new Decimal('299.00'),
      status: CourseStatus.PUBLISHED,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400',
    },
  });

  // Course 3: Intro to CSS (Draft -> Rejected previously)
  const courseCSS = await prisma.course.upsert({
    where: { slug: 'css-intro' },
    update: { status: CourseStatus.DRAFT },
    create: {
      teacherUserId: teacher.id,
      slug: 'css-intro',
      title: 'تصميم الصفحات باستخدام CSS',
      description: 'تعلم أساسيات التصميم وبناء واجهات مستخدم متجاوبة وجميلة.',
      price: new Decimal('99.00'),
      status: CourseStatus.DRAFT,
      thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=400',
    },
  });

  // Course 4: NextJS (Changes Requested)
  const courseNext = await prisma.course.upsert({
    where: { slug: 'nextjs-fullstack' },
    update: { status: CourseStatus.CHANGES_REQUESTED },
    create: {
      teacherUserId: teacher.id,
      slug: 'nextjs-fullstack',
      title: 'بناء تطبيقات متكاملة باستخدام Next.js',
      description: 'تعلم بناء تطبيقات ويب حديثة من البداية وحتى النشر باستخدام React & Next.js.',
      price: new Decimal('499.00'),
      status: CourseStatus.CHANGES_REQUESTED,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400',
    },
  });

  // 4. Create chapters and lessons for courses (so the admin curriculum viewer works)
  const chJS = await prisma.chapter.upsert({
    where: { courseId_orderIndex: { courseId: courseJS.id, orderIndex: 1 } },
    update: {},
    create: {
      courseId: courseJS.id,
      title: 'الفصل الأول: البدايات',
      orderIndex: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { chapterId_orderIndex: { chapterId: chJS.id, orderIndex: 1 } },
    update: {},
    create: {
      chapterId: chJS.id,
      title: 'مرحبا بك في دورة جافاسكريبت',
      orderIndex: 1,
      videoUrl: 'dQw4w9WgXcQ',
    },
  });

  const chPython = await prisma.chapter.upsert({
    where: { courseId_orderIndex: { courseId: coursePython.id, orderIndex: 1 } },
    update: {},
    create: {
      courseId: coursePython.id,
      title: 'الفصل الأول: البرمجة المتزامنة',
      orderIndex: 1,
    },
  });

  // Create a new lesson that is pending review
  const lessonPythonNew = await prisma.lesson.upsert({
    where: { chapterId_orderIndex: { chapterId: chPython.id, orderIndex: 2 } },
    update: {},
    create: {
      chapterId: chPython.id,
      title: 'مفهوم الـ Asyncio و Concurrency',
      orderIndex: 2,
      videoUrl: 'dQw4w9WgXcQ',
    },
  });

  // 5. Seed Approval Requests
  console.log('🌱 Creating approval request records...');

  // Request 1: Pending review for NEW_COURSE (JS course)
  await prisma.approvalRequest.create({
    data: {
      requestType: RequestType.NEW_COURSE,
      status: ApprovalStatus.PENDING_REVIEW,
      courseId: courseJS.id,
      requestedBy: teacher.id,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  // Request 2: Pending review for NEW_LESSON (Python lesson addition)
  await prisma.approvalRequest.create({
    data: {
      requestType: RequestType.NEW_LESSON,
      status: ApprovalStatus.PENDING_REVIEW,
      courseId: coursePython.id,
      lessonId: lessonPythonNew.id,
      requestedBy: teacher.id,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  });

  // Request 3: Approved course request (Python course previously approved)
  await prisma.approvalRequest.create({
    data: {
      requestType: RequestType.NEW_COURSE,
      status: ApprovalStatus.APPROVED,
      courseId: coursePython.id,
      requestedBy: teacher.id,
      reviewedBy: superAdmin.id,
      reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Request 4: Changes Requested for EDIT_COURSE (Next.js course)
  await prisma.approvalRequest.create({
    data: {
      requestType: RequestType.EDIT_COURSE,
      status: ApprovalStatus.CHANGES_REQUESTED,
      courseId: courseNext.id,
      requestedBy: teacher.id,
      reviewedBy: superAdmin.id,
      reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  });

  // Request 5: Rejected request (CSS course request rejected)
  await prisma.approvalRequest.create({
    data: {
      requestType: RequestType.NEW_COURSE,
      status: ApprovalStatus.REJECTED,
      courseId: courseCSS.id,
      requestedBy: teacher.id,
      reviewedBy: superAdmin.id,
      reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Seed approvals database completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
