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
  DELETED = 'DELETED'
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

// ─── Enrollment ──────────────────────────────────────
export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
