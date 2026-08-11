import type { AuthUser } from '@lms/shared-types';
import type React from 'react';
import type { Control } from 'react-hook-form';

import type { CreateCourseFormInput } from './schemas/course.schema';

// ─── Course Status from API ────────────────────────
export type CourseStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'PUBLISHED'
  | 'ARCHIVED';

// ─── Course from API (GET /courses/manage) ─────────
export interface Course {
  id: string;
  slug: string;
  teacherUserId: string;
  title: string;
  category: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  promoVideoUrl: string | null;
  promoVideoProvider: 'YOUTUBE' | 'BUNNY' | null;
  price: string; // Prisma Decimal → serialised as string
  currency: string;
  status: CourseStatus;
  publishedAt: string | null;
  publishedBy: string | null;
  archivedAt: string | null;
  archivedBy: string | null;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    name: string;
  };
  _count: {
    enrollments: number;
    chapters: number;
  };
}

// ─── Pagination metadata from API ──────────────────
export interface CoursesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── API response shape for courses list ───────────
export interface CoursesApiResponse {
  data: Course[];
  meta: CoursesMeta;
}

// ─── Filter types ──────────────────────────────────
export type CourseStatusFilter = 'all' | CourseStatus;
export type PriceRangeFilter = 'all' | 'free' | 'lt100' | 'gt100';

// ─── Domain Types ──────────────────────────────────
export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface Question {
  id: string;
  text: string;
  orderIndex: number;
  options: QuestionOption[];
}

export interface AddQuestionFormProps {
  assignmentId: string;
  questionCount: number;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

export interface QuestionCardProps {
  question: Question;
  index: number;
  onDelete: (id: string) => void;
}

export interface Assignment {
  id: string;
  passingScorePct: number;
  maxAttempts?: number | null;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
  videoProvider?: 'YOUTUBE' | 'BUNNY';
  assignment?: Assignment | null;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  lessons: Lesson[];
}

export interface ExtendedCourse extends Omit<Course, 'chapters'> {
  chapters: Chapter[];
}

export interface CreatedCourse {
  id: string;
  title: string;
  status: string;
  description?: string;
  price?: number;
  currency?: string;
  teacherName?: string;
  teacherUserId?: string;
  thumbnailUrl?: string | null;
  promoVideoUrl?: string | null;
  promoVideoProvider?: string | null;
  createdAt?: string;
}

// ─── Component Props ───────────────────────────────
export interface CourseCardProps {
  course: Course;
  onRefresh?: () => void;
}

export type ActiveTab = 'details' | 'curriculum';

export interface CourseEditorProps {
  courseId: string;
  initialTab?: ActiveTab;
}

export interface CourseRowProps {
  course: Course;
}

export interface CoursesFiltersProps {
  status: CourseStatusFilter;
  priceRange: PriceRangeFilter;
  search: string;
  onStatusChange: (value: CourseStatusFilter) => void;
  onPriceRangeChange: (value: PriceRangeFilter) => void;
  onSearchChange: (value: string) => void;
  onReset?: () => void;
}

export interface CoursesTableProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  meta: CoursesMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onRefresh?: () => void;
}

export interface CourseSuccessViewProps {
  createdCourse: CreatedCourse;
  onReset: () => void;
}

export interface CurriculumBuilderProps {
  courseId: string;
  course: ExtendedCourse;
  fetchCourseCurriculum: () => Promise<void>;
}

export interface AssignmentEditorProps {
  lessonId: string;
  lessonTitle: string;
  type: 'QUIZ' | 'ASSIGNMENT';
  onClose: () => void;
}

export interface CourseCardPreviewProps {
  control?: Control<CreateCourseFormInput>;
  selectedTeacherName: string;
  title?: string;
  price?: number | '';
  currency?: string;
  thumbnailUrl?: string | null;
}

export interface AddLessonFormProps {
  chapterId: string;
  lessonType: 'VIDEO' | 'ASSIGNMENT';
  onClose: () => void;
  fetchCourseCurriculum: () => Promise<void>;
  setActiveAssignmentLesson: (
    lesson: { id: string; title: string; type: 'QUIZ' | 'ASSIGNMENT' } | null,
  ) => void;
}

export interface ChapterCardProps {
  chapter: Chapter;
  fetchCourseCurriculum: () => Promise<void>;
  setActiveAssignmentLesson: (
    lesson: { id: string; title: string; type: 'QUIZ' | 'ASSIGNMENT' } | null,
  ) => void;
}

export interface CourseDetailsFormProps {
  courseId: string;
  course: ExtendedCourse;
  onUpdate: (updatedCourse: ExtendedCourse) => void;
  onNavigateToCurriculum: () => void;
}

export interface CourseFormFieldsProps {
  teachers: Teacher[];
  isLoadingTeachers: boolean;
  currentUser: AuthUser | null;
  headerRight?: React.ReactNode;
}

export interface CourseSidebarProps {
  course: ExtendedCourse;
  isAddingChapter: boolean;
  setIsAddingChapter: (val: boolean) => void;
  newChapterTitle: string;
  setNewChapterTitle: (val: string) => void;
  isSubmittingChapter: boolean;
  handleAddChapter: (e: React.FormEvent) => void;
}

export interface LessonRowProps {
  lesson: Lesson;
  lessonIndex: number;
  fetchCourseCurriculum: () => Promise<void>;
  setActiveAssignmentLesson: (
    lesson: { id: string; title: string; type: 'QUIZ' | 'ASSIGNMENT' } | null,
  ) => void;
}
