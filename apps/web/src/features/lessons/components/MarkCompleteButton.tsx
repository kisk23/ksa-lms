'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';

import { useMarkLessonComplete } from '../hooks/useMarkLessonComplete';

interface MarkCompleteButtonProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  isCompleted: boolean;
}

/**
 * MarkCompleteButton
 *
 * Primary CTA below the video player.
 * - When not completed: green "تحديد كمكتمل" button
 * - While pending: spinner + disabled
 * - When completed: grey "تم الإكمال" with checkmark (still clickable for idempotent re-call)
 */
export function MarkCompleteButton({
  courseId,
  chapterId,
  lessonId,
  isCompleted,
}: MarkCompleteButtonProps) {
  const { mutate, isPending } = useMarkLessonComplete({ courseId, chapterId, lessonId });

  if (isCompleted) {
    return (
      <button
        onClick={() => mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 font-semibold text-sm hover:bg-green-100 transition-colors"
      >
        <CheckCircle2 size={18} />
        تم الإكمال
      </button>
    );
  }

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 active:scale-95 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <CheckCircle2 size={18} />
      )}
      {isPending ? 'جارٍ الحفظ...' : 'تحديد كمكتمل'}
    </button>
  );
}
