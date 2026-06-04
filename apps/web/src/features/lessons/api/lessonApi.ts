import axios from 'axios';

import type {
  LessonDetail,
  Assignment,
  LessonFile,
  LessonProgress,
  CourseProgress,
  LessonProgressStatus,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Shared axios instance — reads base URL from env.
 * Set in apps/web/.env.local:
 *   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send JWT cookie / auth header
});

// ─────────────────────────────────────────────────────────────────────────────
// Lesson
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /lessons/:lessonId
 *
 * Fetches details for a single lesson from the backend, and maps the
 * videoUrl database column into the youtubeVideoId property expected by the frontend.
 */
export async function getLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<LessonDetail> {
  const { data } = await apiClient.get<ApiResponse<any>>(`/lessons/${lessonId}`);

  const lesson = data.data;

  return {
    ...lesson,
    youtubeVideoId: lesson.videoUrl,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mark complete   POST /progress/lessons/:lessonId/complete
// ─────────────────────────────────────────────────────────────────────────────

export async function markLessonComplete(lessonId: string): Promise<LessonProgress> {
  const { data } = await apiClient.post<ApiResponse<LessonProgress>>(
    `/progress/lessons/${lessonId}/complete`,
  );

  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Update watch percentage   POST /progress/lessons/:lessonId/watch
// ─────────────────────────────────────────────────────────────────────────────

export async function updateWatchPct(
  lessonId: string,
  watchedPct: number,
): Promise<LessonProgress> {
  const { data } = await apiClient.post<ApiResponse<LessonProgress>>(
    `/progress/lessons/${lessonId}/watch`,
    { watchedPct },
  );

  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Assignments   GET /lessons/:lessonId/assignment
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the assignment for the lesson. A lesson has at most 1 assignment.
 * Wraps the returned singular assignment object into an array to match the frontend type.
 * Returns an empty array if the backend returns a 404 (indicating no assignment exists).
 */
export async function getAssignments(lessonId: string): Promise<Assignment[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<Assignment>>(
      `/lessons/${lessonId}/assignment`,
    );

    return [data.data];
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Files   GET /lessons/:lessonId/files
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LessonFile is not yet fully in the Prisma schema on the backend.
 * Catches 404 errors and returns an empty array cleanly to avoid console warnings.
 */
export async function getLessonFiles(lessonId: string): Promise<LessonFile[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<LessonFile[]>>(`/lessons/${lessonId}/files`);

    return data.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Course progress   GET /progress/courses/:courseId
// ─────────────────────────────────────────────────────────────────────────────

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const { data } = await apiClient.get<ApiResponse<CourseProgress>>(
    `/progress/courses/${courseId}`,
  );

  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// All lesson statuses   GET /progress/courses/:courseId/lessons
// Used by CurriculumSidebar to mark completed lessons
// ─────────────────────────────────────────────────────────────────────────────

export async function getLessonStatuses(courseId: string): Promise<LessonProgressStatus[]> {
  const { data } = await apiClient.get<ApiResponse<LessonProgressStatus[]>>(
    `/progress/courses/${courseId}/lessons`,
  );

  return data.data;
}
