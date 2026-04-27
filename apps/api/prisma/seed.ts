import { PrismaClient, UserRole, CourseStatus, DifficultyLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const devCategory = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: { name: 'Web Development', slug: 'web-development' },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: { name: 'Design', slug: 'design' },
  });

  const dataCategory = await prisma.category.upsert({
    where: { slug: 'data-science' },
    update: {},
    create: { name: 'Data Science', slug: 'data-science' },
  });

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.local' },
    update: {},
    create: {
      email: 'admin@lms.local',
      password: '$2b$12$placeholder.hash', // TODO: hash with bcrypt
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  // Instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@lms.local' },
    update: {},
    create: {
      email: 'instructor@lms.local',
      password: '$2b$12$placeholder.hash',
      firstName: 'Jane',
      lastName: 'Instructor',
      role: UserRole.INSTRUCTOR,
      bio: 'Senior full-stack developer with 10+ years of experience.',
    },
  });

  // Student
  const student = await prisma.user.upsert({
    where: { email: 'student@lms.local' },
    update: {},
    create: {
      email: 'student@lms.local',
      password: '$2b$12$placeholder.hash',
      firstName: 'John',
      lastName: 'Student',
      role: UserRole.STUDENT,
    },
  });

  // Sample course
  const course = await prisma.course.upsert({
    where: { slug: 'typescript-fundamentals' },
    update: {},
    create: {
      title: 'TypeScript Fundamentals',
      slug: 'typescript-fundamentals',
      description: 'Master TypeScript from the ground up. Learn types, interfaces, generics, and advanced patterns.',
      price: 2999,
      status: CourseStatus.PUBLISHED,
      difficulty: DifficultyLevel.BEGINNER,
      instructorId: instructor.id,
      categoryId: devCategory.id,
    },
  });

  // Sections & lessons
  const section1 = await prisma.section.create({
    data: {
      title: 'Getting Started',
      order: 1,
      courseId: course.id,
      lessons: {
        create: [
          { title: 'Welcome & Course Overview', type: 'VIDEO', order: 1, duration: 300, isFree: true },
          { title: 'Setting Up Your Environment', type: 'TEXT', order: 2, content: 'Install Node.js and TypeScript...' },
          { title: 'Your First TypeScript File', type: 'VIDEO', order: 3, duration: 600 },
        ],
      },
    },
  });

  const section2 = await prisma.section.create({
    data: {
      title: 'Type System Deep Dive',
      order: 2,
      courseId: course.id,
      lessons: {
        create: [
          { title: 'Primitive Types', type: 'VIDEO', order: 1, duration: 480 },
          { title: 'Interfaces vs Types', type: 'TEXT', order: 2, content: 'Understanding the differences...' },
          { title: 'Generics', type: 'VIDEO', order: 3, duration: 720 },
        ],
      },
    },
  });

  console.log('✅ Seed completed!');
  console.log({ admin: admin.email, instructor: instructor.email, student: student.email });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
