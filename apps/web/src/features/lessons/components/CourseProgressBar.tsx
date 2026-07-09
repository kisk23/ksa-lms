import { Trophy } from 'lucide-react';

import type { CourseProgress } from '../types';

interface CourseProgressBarProps {
  progress: CourseProgress | null | undefined;
  /** Fallback total when progress row hasn't loaded yet — pass chapters lesson count */
  fallbackTotal?: number;
  courseTitle?: string;
}

/**
 * CourseProgressBar
 *
 * Displays above the video player. Shows:
 *   - Course title (optional)
 *   - Completed / total lesson count
 *   - Animated fill bar driven by progressPct from the backend
 *   - A trophy icon + "أكملت الدورة!" celebration when progressPct === 100
 *
 * Data source: GET /progress/courses/:courseId  (useCourseProgress hook)
 *
 * Skeleton state: when progress is undefined/null the bar renders at 0%
 * with a pulsing shimmer so there's no layout shift while loading.
 */
export function CourseProgressBar({
  progress,
  fallbackTotal = 0,
  courseTitle,
}: CourseProgressBarProps) {
  const isLoading = progress === undefined;
  const pct = progress?.progressPct ?? 0;
  const completed = progress?.completedLessons ?? 0;
  const total = progress?.totalLessons ?? fallbackTotal;
  const isDone = pct === 100;

  // ── Colour tokens ──────────────────────────────────────────────────────────
  // 0–39%  → primary blue
  // 40–79% → amber
  // 80–99% → primary blue (nearly there)
  // 100%   → green celebration
  const barColor = isDone ? 'bg-green-500' : pct >= 40 && pct < 80 ? 'bg-amber-400' : 'bg-primary';

  const textColor = isDone ? 'text-green-600' : 'text-primary';

  return (
    <div
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex flex-col gap-2"
      dir="rtl"
      aria-label={`تقدم الدورة ${pct}%`}
    >
      {/* ── Top row: label + count ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isDone ? (
            <Trophy size={16} className="text-green-500 shrink-0" />
          ) : (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isLoading ? 'bg-gray-200 animate-pulse' : barColor
              }`}
            />
          )}

          <span className="text-sm font-semibold text-gray-700 truncate">
            {isDone
              ? 'أكملت الدورة! 🎉'
              : courseTitle
                ? `تقدمك في ${courseTitle}`
                : 'تقدمك في الدورة'}
          </span>
        </div>

        {/* Percentage + fraction */}
        <div className="flex items-center gap-2 shrink-0">
          {total > 0 && (
            <span className="text-xs text-gray-400 tabular-nums">
              {completed} / {total} درس
            </span>
          )}
          <span
            className={`text-sm font-bold tabular-nums ${isLoading ? 'text-gray-300' : textColor}`}
          >
            {isLoading ? '—' : `${pct}%`}
          </span>
        </div>
      </div>

      {/* ── Progress track ── */}
      <div
        className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {isLoading ? (
          /* Skeleton shimmer */
          <div className="h-full w-1/3 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
