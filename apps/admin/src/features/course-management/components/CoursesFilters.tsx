'use client';

import { Button } from '@shared/components/ui/Button';
import { Select } from '@shared/components/ui/Select';
import { ListFilter, Search } from 'lucide-react';

import type { CourseStatusFilter, PriceRangeFilter, CoursesFiltersProps } from '../types';

const statusOptions = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'DRAFT', label: 'مسودة' },
  { value: 'PENDING_REVIEW', label: 'قيد المراجعة' },
  { value: 'CHANGES_REQUESTED', label: 'بحاجة تعديلات' },
  { value: 'PUBLISHED', label: 'منشور' },
  { value: 'ARCHIVED', label: 'مؤرشف' },
];

const priceOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'free', label: 'مجاني' },
  { value: 'lt100', label: 'أقل من 100 ر.س' },
  { value: 'gt100', label: 'أكثر من 100 ر.س' },
];

export function CoursesFilters({
  status,
  priceRange,
  search,
  onStatusChange,
  onPriceRangeChange,
  onSearchChange,
  onReset,
}: CoursesFiltersProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md mb-margin flex flex-wrap gap-4 items-end">
      {/* Search Input */}
      <div className="flex flex-col gap-1 min-w-[200px] flex-1">
        <label className="font-caption-ar text-caption-ar text-on-surface-variant">بحث</label>
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline/60 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالعنوان أو الوصف..."
            className="w-full pl-4 pr-10 py-2.5 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/50 text-sm"
          />
        </div>
      </div>

      <Select
        label="الحالة"
        options={statusOptions}
        value={status}
        onChange={(v) => onStatusChange(v as CourseStatusFilter)}
      />
      <Select
        label="نطاق السعر"
        options={priceOptions}
        value={priceRange}
        onChange={(v) => onPriceRangeChange(v as PriceRangeFilter)}
      />

      <Button
        variant="secondary"
        icon={ListFilter}
        className="h-[42px] font-bold border border-outline-variant"
        onClick={onReset}
      >
        إعادة تعيين
      </Button>
    </div>
  );
}
