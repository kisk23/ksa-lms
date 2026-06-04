import { useQuery } from '@tanstack/react-query';

import { getLesson } from '../api/lessonApi';
import { lessonKeys } from './lessonKeys';

/**
 * Fetches the full lesson detail including its assignment and the student's progress row.
 * Backed by GET /courses/:courseId/chapters/:chapterId/lessons/:lessonId
 */
export function useLesson(courseId: string, chapterId: string, lessonId: string) {
  return useQuery({
    queryKey: lessonKeys.detail(courseId || '', chapterId || '', lessonId),
    queryFn: () => getLesson(courseId, chapterId, lessonId),
    enabled: Boolean(lessonId),
    staleTime: 1000 * 60 * 5, // 5 min — lessons don't change often
    retry: 2,
  });
}
