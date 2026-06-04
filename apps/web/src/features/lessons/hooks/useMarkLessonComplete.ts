import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markLessonComplete } from '../api/lessonApi';
import { lessonKeys } from './lessonKeys';

interface UseMarkLessonCompleteOptions {
  courseId: string;
  chapterId: string;
  lessonId: string;
}

/**
 * Marks a lesson as completed.
 *
 * Optimistic update strategy:
 *  1. Immediately marks the lesson as completed in the lesson-statuses cache
 *     so the sidebar checkmark appears without waiting for the server.
 *  2. On success, invalidates:
 *     - The lesson detail (progress row may have changed)
 *     - The course progress (progressPct and completedLessons updated by the backend)
 *     - The lesson statuses list (sidebar)
 *  3. On error, rolls back the optimistic update.
 *
 * The backend POST /progress/lessons/:id/complete is idempotent — safe to
 * call multiple times with no side effects.
 */
export function useMarkLessonComplete({
  courseId,
  chapterId,
  lessonId,
}: UseMarkLessonCompleteOptions) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => markLessonComplete(lessonId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: lessonKeys.statuses(courseId) });
      // Remove: detail cancellation/snapshot — lesson endpoint doesn't own progress

      const previousStatuses = qc.getQueryData(lessonKeys.statuses(courseId));

      qc.setQueryData(lessonKeys.statuses(courseId), (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: any) =>
          item.lessonId === lessonId
            ? {
                ...item,
                progress: {
                  ...(item.progress ?? {}), // <-- handle null progress
                  isCompleted: true,
                  completedAt: new Date().toISOString(),
                },
              }
            : item,
        );
      });

      return { previousStatuses };
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.progress(courseId) });
      qc.invalidateQueries({ queryKey: lessonKeys.statuses(courseId) });
      // Remove: detail invalidation — it's not needed and causes a stale read
    },

    onError: (_err, _vars, context) => {
      if (context?.previousStatuses !== undefined) {
        qc.setQueryData(lessonKeys.statuses(courseId), context.previousStatuses);
      }
    },
  });
}
