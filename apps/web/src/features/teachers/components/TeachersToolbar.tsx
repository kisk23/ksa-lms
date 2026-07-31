import type { SortOption, SortOptionConfig } from '@/features/teachers/types/teacher';
import { ArrowUpDown } from 'lucide-react';

interface TeachersToolbarProps {
  count: number;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  sortOptions: SortOptionConfig[];
}

export function TeachersToolbar({
  count,
  sortBy,
  onSortChange,
  sortOptions,
}: TeachersToolbarProps) {
  return (
    <section className="mb-10 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-surface-container px-4 py-2">
          <span className="text-sm font-medium text-on-surface">
            {count.toLocaleString('ar-EG')} معلماً متاحاً
          </span>
        </div>
      </div>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="
        appearance-none
        rounded-full
        border
        border-outline-variant
        bg-surface/10
        py-2
        pl-10
        pr-5
        text-sm
        text-on-surface
        transition-colors
        hover:border-primary-container
        focus:border-primary-container
        focus:outline-none
      "
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          <ArrowUpDown />
        </span>
      </div>
    </section>
  );
}
