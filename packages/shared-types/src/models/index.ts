// ─── User ────────────────────────────────────────────
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  ASSISTANT_ADMIN = 'ASSISTANT_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ParentRelationship {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN',
}

export interface IParentStudent {
  id: string;
  parentId: string;
  studentId: string;
  relationship: ParentRelationship;
}

export interface IUser {
  id: string;
  name: string;
  identity: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  guardianPhone?: string;
  guardianIdentity?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum UserPermission {
  // Course Management
  COURSE_CREATE = 'COURSE_CREATE',
  COURSE_READ = 'COURSE_READ',
  COURSE_UPDATE = 'COURSE_UPDATE',
  COURSE_DELETE = 'COURSE_DELETE',

  // Lesson Management
  LESSON_CREATE = 'LESSON_CREATE',
  LESSON_READ = 'LESSON_READ',
  LESSON_UPDATE = 'LESSON_UPDATE',
  LESSON_DELETE = 'LESSON_DELETE',

  // Assignment Management
  ASSIGNMENT_CREATE = 'ASSIGNMENT_CREATE',
  ASSIGNMENT_READ = 'ASSIGNMENT_READ',
  ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE',
  ASSIGNMENT_DELETE = 'ASSIGNMENT_DELETE',
  ASSIGNMENT_SUBMIT = 'ASSIGNMENT_SUBMIT',
  ASSIGNMENT_GRADE = 'ASSIGNMENT_GRADE',

  // User Management
  USER_CREATE = 'USER_CREATE',
  USER_READ = 'USER_READ',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',

  // Enrollment Management
  ENROLLMENT_CREATE = 'ENROLLMENT_CREATE',
  ENROLLMENT_READ = 'ENROLLMENT_READ',
  ENROLLMENT_UPDATE = 'ENROLLMENT_UPDATE',
  ENROLLMENT_DELETE = 'ENROLLMENT_DELETE',

  // Payment Management
  PAYMENT_READ = 'PAYMENT_READ',

  // Progress Management
  PROGRESS_READ = 'PROGRESS_READ',
  PROGRESS_UPDATE = 'PROGRESS_UPDATE',
}

// ─── Course ──────────────────────────────────────────
export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum VideoProvider {
  YOUTUBE = 'YOUTUBE',
  BUNNY = 'BUNNY',
}

export enum CourseAuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  RESTORED = 'RESTORED',
  DELETED = 'DELETED',
}

export interface ICourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  price: number;
  status: CourseStatus;
  difficulty: DifficultyLevel;
  instructorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Lesson ──────────────────────────────────────────
export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
}

export interface ILesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  type: LessonType;
  duration?: number;
  order: number;
  courseId: string;
  sectionId: string;
  isFree: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Lesson Detail ───────────────────────────────────
export interface LessonDetail {
  id: string;
  chapterId: string;
  title: string;
  orderIndex: number;
  youtubeVideoId: string;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  assignment?: Assignment | null;
  progress?: LessonProgress | null;
}

// ─── Assignment ──────────────────────────────────────
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  orderIndex: number;
}

export interface Question {
  id: string;
  text: string;
  orderIndex: number;
  options: QuestionOption[];
}

export interface Assignment {
  id: string;
  lessonId: string;
  passingScorePct: number;
  maxAttempts: number | null;
  questions: Question[];
}

// ─── Progress ────────────────────────────────────────
export interface LessonProgress {
  id: string;
  studentUserId: string;
  lessonId: string;
  lessonVersion: number;
  videoWatchedPct: number;
  videoCompletedAt: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  updatedAt: string;
}

export interface CourseProgress {
  id: string;
  studentUserId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPct: number;
  completedAt: string | null;
  lastLesson?: { id: string; title: string; orderIndex: number } | null;
}

export interface LessonProgressStatus {
  lessonId: string;
  title: string;
  orderIndex: number;
  chapter: { id: string; title: string; orderIndex: number };
  progress: LessonProgress | null;
}

// ─── Lesson Files ────────────────────────────────────
export interface LessonFile {
  id: string;
  lessonId: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

// ─── Navigation Helpers ───────────────────────────────
export interface FlatLesson {
  lessonId: string;
  chapterId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  chapterOrderIndex: number;
  isCompleted: boolean;
}

// ─── Enrollment ──────────────────────────────────────
export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
}

export interface IEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: Date;
  completedAt?: Date;
}

// ─── Category ────────────────────────────────────────
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

// ─── Section (Course Module) ─────────────────────────
export interface ISection {
  id: string;
  title: string;
  order: number;
  courseId: string;
  archivedAt?: Date;
}
