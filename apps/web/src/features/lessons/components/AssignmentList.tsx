import { ClipboardList, AlertCircle } from 'lucide-react';

import type { Assignment } from '../types';

interface AssignmentListProps {
  assignments: Assignment[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * AssignmentList
 *
 * Renders the list of assignments for a lesson.
 * Shows skeleton while loading, error banner on failure,
 * and a friendly empty state when there are no assignments.
 */
export function AssignmentList({ assignments, isLoading, error }: AssignmentListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    // If the backend endpoint isn't implemented yet, show a soft warning
    const isNotFound = (error as any)?.response?.status === 404;
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <AlertCircle size={18} className="shrink-0" />
        {isNotFound
          ? 'لا تتوفر واجبات لهذا الدرس حتى الآن.'
          : 'تعذّر تحميل الواجبات. يرجى المحاولة لاحقاً.'}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
        <ClipboardList size={36} />
        <p className="text-sm">لا توجد واجبات لهذا الدرس.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" dir="rtl">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-800">اختبار الدرس</span>
            <span className="text-xs text-gray-500">
              {assignment.questions.length} سؤال • درجة النجاح {assignment.passingScorePct}%
              {assignment.maxAttempts !== null && ` • ${assignment.maxAttempts} محاولات`}
            </span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
            ابدأ
          </button>
        </div>
      ))}
    </div>
  );
}
