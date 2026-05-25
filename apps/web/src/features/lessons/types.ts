// ─── Re-exports from shared course types ──────────────────────────────────────
// Import these from the courses feature to keep a single source of truth.
export type { Lesson, Chapter, CourseDetails, Instructor } from '@/features/courses/types';

// ─── Lesson detail (single lesson with assignment + progress) ─────────────────

/** Full lesson shape returned by GET /courses/:cId/chapters/:chId/lessons/:lId */
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
  /** Populated by the backend join — contains questions */
  assignment?: Assignment | null;
  /** Progress row for the currently authenticated student (null = not started) */
  progress?: LessonProgress | null;
}

// ─── Assignment ───────────────────────────────────────────────────────────────

export interface QuestionOption {
  id: string;
  text: string;
  /** Backend only sends isCorrect after submission, not before */
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

// ─── Progress ─────────────────────────────────────────────────────────────────

/** LessonProgress row shape (mirrors Prisma model) */
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

/** CourseProgress summary */
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

/** Per-lesson progress row returned by GET /progress/courses/:courseId/lessons */
export interface LessonProgressStatus {
  lessonId: string;
  title: string;
  orderIndex: number;
  chapter: { id: string; title: string; orderIndex: number };
  progress: LessonProgress | null;
}

// ─── Files ────────────────────────────────────────────────────────────────────

/** Downloadable file attached to a lesson (not in Prisma schema yet — future field) */
export interface LessonFile {
  id: string;
  lessonId: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

// ─── Navigation helpers ───────────────────────────────────────────────────────

/** Flat list item used to build prev/next navigation */
export interface FlatLesson {
  lessonId: string;
  chapterId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  chapterOrderIndex: number;
  isCompleted: boolean;
}
