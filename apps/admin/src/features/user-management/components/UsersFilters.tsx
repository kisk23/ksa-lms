'use client';

import { StatusDot } from '@shared/components/ui/StatusDot';
import { SlidersHorizontal } from 'lucide-react';

import type { RoleFilter, StatusFilter } from '../types';

const roleFilters: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'student', label: 'طالب' },
  { value: 'teacher', label: 'مدرس' },
  { value: 'parent', label: 'ولي أمر' },
];

const statusFilters: {
  value: StatusFilter;
  label: string;
  dot?: 'success' | 'error' | 'warning';
}[] = [
  { value: 'all', label: 'الكل' },
  { value: 'active', label: 'نشط', dot: 'success' },
  { value: 'blocked', label: 'محظور', dot: 'error' },
  { value: 'pending', label: 'معلق', dot: 'warning' },
];

type UsersFiltersProps = {
  role: RoleFilter;
  status: StatusFilter;
  onRoleChange: (role: RoleFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
};

export function UsersFilters({ role, status, onRoleChange, onStatusChange }: UsersFiltersProps) {
  const chipBase =
    'px-3 py-1.5 rounded-full font-caption-ar text-xs transition-colors flex items-center gap-1';
  const chipActive = 'bg-primary-container text-on-primary';
  const chipInactive = 'bg-surface-container text-on-surface hover:bg-surface-variant';

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-3">
        {/* Role */}
        <div className="flex items-center gap-2">
          <span className="font-caption-ar text-caption-ar text-on-surface-variant">الدور:</span>
          <div className="flex gap-2">
            {roleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onRoleChange(filter.value)}
                className={`${chipBase} ${role === filter.value ? chipActive : chipInactive}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-outline-variant/30 hidden md:block" />

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="font-caption-ar text-caption-ar text-on-surface-variant">الحالة:</span>
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onStatusChange(filter.value)}
                className={`${chipBase} ${status === filter.value ? chipActive : chipInactive}`}
              >
                {filter.dot && <StatusDot variant={filter.dot} />}
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="text-primary flex items-center gap-1 font-caption-ar text-caption-ar hover:text-primary/80 transition-colors">
        <SlidersHorizontal size={14} />
        فلاتر متقدمة
      </button>
    </div>
  );
}
