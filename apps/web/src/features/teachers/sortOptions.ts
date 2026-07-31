import type { SortOptionConfig } from '@/features/teachers/types/teacher';

export const sortOptions: SortOptionConfig[] = [
  { value: 'top-rated', label: 'الأعلى تقييماً' },
  { value: 'most-students', label: 'الأكثر طلاباً' },
  { value: 'newest', label: 'المضاف حديثاً' },
];
