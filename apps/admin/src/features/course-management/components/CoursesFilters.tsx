'use client';

import { Button } from '@shared/components/ui/Button';
import { Select } from '@shared/components/ui/Select';
import { ListFilter } from 'lucide-react';

import type { CourseStatusFilter, PriceRangeFilter, SubjectFilter, TeacherFilter } from '../types';

const subjectOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'math', label: 'الرياضيات' },
  { value: 'physics', label: 'الفيزياء' },
  { value: 'chemistry', label: 'الكيمياء' },
];

const teacherOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'ahmed', label: 'أحمد محمد' },
  { value: 'sara', label: 'سارة علي' },
];

const statusOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'active', label: 'نشط' },
  { value: 'suspended', label: 'معلق' },
  { value: 'pending', label: 'قيد الانتظار' },
];

const priceOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'free', label: 'مجاني' },
  { value: 'lt100', label: 'أقل من 100 ر.س' },
  { value: 'gt100', label: 'أكثر من 100 ر.س' },
];

type CoursesFiltersProps = {
  subject: SubjectFilter;
  teacher: TeacherFilter;
  status: CourseStatusFilter;
  priceRange: PriceRangeFilter;
  onSubjectChange: (value: SubjectFilter) => void;
  onTeacherChange: (value: TeacherFilter) => void;
  onStatusChange: (value: CourseStatusFilter) => void;
  onPriceRangeChange: (value: PriceRangeFilter) => void;
  onReset?: () => void;
};

export function CoursesFilters({
  subject,
  teacher,
  status,
  priceRange,
  onSubjectChange,
  onTeacherChange,
  onStatusChange,
  onPriceRangeChange,
  onReset,
}: CoursesFiltersProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md mb-margin flex flex-wrap gap-4 items-end">
      <Select label="المادة" options={subjectOptions} value={subject} onChange={onSubjectChange} />
      <Select label="المعلم" options={teacherOptions} value={teacher} onChange={onTeacherChange} />
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
        إعادة تعيين الفلاتر
      </Button>
    </div>
  );
}
