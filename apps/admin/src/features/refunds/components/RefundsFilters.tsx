'use client';

import { Search } from 'lucide-react';

import type { RefundFilters, RefundStatus } from '../types';

interface RefundsFiltersProps {
  filters: RefundFilters;
  onFiltersChange: (filters: Partial<RefundFilters>) => void;
}

const FILTER_TABS: { value: RefundStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'pending', label: 'معلق' },
  { value: 'approved', label: 'مقبول' },
  { value: 'rejected', label: 'مرفوض' },
];

export function RefundsFilters({ filters, onFiltersChange }: RefundsFiltersProps) {
  return (
    <div className="flex items-center justify-between p-md border-b border-outline-variant/30 bg-surface-bright">
      {/* Status Tabs */}
      <div className="flex items-center gap-xs bg-surface-container-low p-xs rounded-lg border border-outline-variant/30">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFiltersChange({ status: tab.value })}
            className={`px-sm py-xs rounded-md font-body-md-ar text-caption-ar transition-colors ${
              filters.status === tab.value
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-4 pr-10 py-sm rounded-lg border border-outline-variant/50 bg-surface focus:border-primary focus:ring-1 focus:ring-primary w-64 text-caption-ar font-caption-ar text-on-surface placeholder:text-outline transition-all"
          placeholder="بحث بالاسم أو الكورس..."
        />
      </div>
    </div>
  );
}
