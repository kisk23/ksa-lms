'use client';

import type { CourseStatus } from '../types';

interface CourseFiltersProps {
  status: CourseStatus | undefined;
  onStatusChange: (status: CourseStatus | undefined) => void;
}

const STATUS_OPTIONS: { label: string; value: CourseStatus | '' }[] = [
  { label: 'الكل', value: '' },
  { label: 'منشور', value: 'PUBLISHED' },
  { label: 'مسودة', value: 'DRAFT' },
  { label: 'مؤرشف', value: 'ARCHIVED' },
];

export function CourseFilters({ status, onStatusChange }: CourseFiltersProps) {
  return (
    <aside className="w-full md:w-64 shrink-0" dir="rtl">
      <div className="bg-surface border border-border rounded-[--radius-lg] p-5 shadow-sm sticky top-24">
        <h3 className="text-text font-semibold text-base mb-5">تصفية الدورات</h3>

        {/* Status */}
        <div>
          <label
            htmlFor="course-status-filter"
            className="block text-text-muted text-xs mb-2"
          >
            الحالة
          </label>
          <select
            id="course-status-filter"
            value={status ?? ''}
            onChange={(e) =>
              onStatusChange((e.target.value as CourseStatus) || undefined)
            }
            className="w-full bg-bg border border-border rounded-radius-sm px-3 py-2 text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}