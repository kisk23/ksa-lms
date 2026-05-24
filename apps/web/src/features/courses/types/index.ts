// ─── Enums — mirrored from backend Prisma schema ─────────────────────────────

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// ─── Core models ──────────────────────────────────────────────────────────────

export interface Instructor {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  orderIndex: number;
  youtubeVideoId: string;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Lightweight shape returned by GET /courses (list).
 * Matches CoursesService.findAll() → include: { teacher, _count }
 */
export interface Course {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  /** Prisma Decimal is serialised as a string over JSON — coerce with Number() before display */
  price: string | number;
  currency: string;
  status: CourseStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  teacher: Instructor;
  _count: {
    enrollments: number;
    chapters: number;
  };
  thumbnailUrl?: string | null;
}

/**
 * Full shape returned by GET /courses/:id.
 * Adds chapters (with nested lessons) from CoursesService.findOne().
 */
export interface CourseDetails extends Course {
  chapters: Chapter[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CoursesListResponse {
  data: Course[];
  meta: PaginationMeta;
}

export interface CoursesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CourseStatus;
}
