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

    // ── Step 1: optimistic update ──────────────────────────────────────────
    onMutate: async () => {
      // Cancel any in-flight refetches so they don't overwrite our optimistic data
      await qc.cancelQueries({ queryKey: lessonKeys.statuses(courseId) });
      await qc.cancelQueries({ queryKey: lessonKeys.detail(courseId, chapterId, lessonId) });

      // Snapshot current data for rollback
      const previousStatuses = qc.getQueryData(lessonKeys.statuses(courseId));
      const previousDetail = qc.getQueryData(lessonKeys.detail(courseId, chapterId, lessonId));

      // Optimistically mark completed in the statuses list
      qc.setQueryData(lessonKeys.statuses(courseId), (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: any) =>
          item.lessonId === lessonId
            ? {
                ...item,
                progress: {
                  ...item.progress,
                  isCompleted: true,
                  completedAt: new Date().toISOString(),
                },
              }
            : item,
        );
      });

      // Optimistically mark completed in the lesson detail
      qc.setQueryData(lessonKeys.detail(courseId, chapterId, lessonId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          progress: { ...old.progress, isCompleted: true, completedAt: new Date().toISOString() },
        };
      });

      return { previousStatuses, previousDetail };
    },

    // ── Step 2: invalidate on success ──────────────────────────────────────
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(courseId, chapterId, lessonId) });
      qc.invalidateQueries({ queryKey: lessonKeys.progress(courseId) });
      qc.invalidateQueries({ queryKey: lessonKeys.statuses(courseId) });
    },

    // ── Step 3: rollback on error ──────────────────────────────────────────
    onError: (_err, _vars, context) => {
      if (context?.previousStatuses !== undefined) {
        qc.setQueryData(lessonKeys.statuses(courseId), context.previousStatuses);
      }
      if (context?.previousDetail !== undefined) {
        qc.setQueryData(lessonKeys.detail(courseId, chapterId, lessonId), context.previousDetail);
      }
    },
  });
}
