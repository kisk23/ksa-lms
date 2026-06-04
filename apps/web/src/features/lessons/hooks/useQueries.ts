import { useQuery } from '@tanstack/react-query';

import {
  getAssignments,
  getLessonFiles,
  getCourseProgress,
  getLessonStatuses,
} from '../api/lessonApi';
import { lessonKeys } from './lessonKeys';

// ─────────────────────────────────────────────────────────────────────────────
// useAssignments
// GET /lessons/:lessonId/assignments
// ─────────────────────────────────────────────────────────────────────────────

export function useAssignments(lessonId: string) {
  return useQuery({
    queryKey: lessonKeys.assignments(lessonId),
    queryFn: () => getAssignments(lessonId),
    enabled: Boolean(lessonId),
    staleTime: 1000 * 60 * 5,
    // Backend endpoint not yet implemented — return empty array on 404
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useLessonFiles
// GET /lessons/:lessonId/files
// ─────────────────────────────────────────────────────────────────────────────

export function useLessonFiles(lessonId: string) {
  return useQuery({
    queryKey: lessonKeys.files(lessonId),
    queryFn: () => getLessonFiles(lessonId),
    enabled: Boolean(lessonId),
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useCourseProgress
// GET /progress/courses/:courseId  — header progress bar
// ─────────────────────────────────────────────────────────────────────────────

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: lessonKeys.progress(courseId),
    queryFn: () => getCourseProgress(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 2, // shorter TTL — updates when lessons are completed
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useLessonStatuses
// GET /progress/courses/:courseId/lessons  — sidebar checkmarks
// ─────────────────────────────────────────────────────────────────────────────

export function useLessonStatuses(courseId: string) {
  return useQuery({
    queryKey: lessonKeys.statuses(courseId),
    queryFn: () => getLessonStatuses(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 2,
  });
}
