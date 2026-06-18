import type { CourseStatus } from '../types';

export const statusConfig: Record<CourseStatus, { label: string; bg: string; color: string }> = {
  DRAFT: { label: 'مسودة', bg: 'bg-[#E8EAF6]', color: 'text-[#3949AB]' },
  PENDING_REVIEW: { label: 'قيد المراجعة', bg: 'bg-[#E8F0FE]', color: 'text-[#1967D2]' },
  CHANGES_REQUESTED: { label: 'بحاجة تعديلات', bg: 'bg-[#FEF7E0]', color: 'text-[#B06000]' },
  PUBLISHED: { label: 'منشور', bg: 'bg-[#E6F4EA]', color: 'text-[#137333]' },
  ARCHIVED: { label: 'مؤرشف', bg: 'bg-[#FCE8E6]', color: 'text-[#C5221F]' },
};
