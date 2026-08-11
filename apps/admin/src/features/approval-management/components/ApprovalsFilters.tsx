'use client';

import type { ApprovalStatusFilter } from '../types';

const filters: { value: ApprovalStatusFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'PENDING_REVIEW', label: 'في الانتظار' },
  { value: 'APPROVED', label: 'مقبول' },
  { value: 'REJECTED', label: 'مرفوض' },
  { value: 'CHANGES_REQUESTED', label: 'يحتاج تعديلات' },
];

interface ApprovalsFiltersProps {
  status: ApprovalStatusFilter;
  onStatusChange: (status: ApprovalStatusFilter) => void;
}

export function ApprovalsFilters({ status, onStatusChange }: ApprovalsFiltersProps) {
  return (
    <div className="flex items-center gap-sm overflow-x-auto pb-2">
      {filters.map((filter) => {
        const isActive = status === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`px-6 py-2 rounded-full font-body-md-ar whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-variant'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
