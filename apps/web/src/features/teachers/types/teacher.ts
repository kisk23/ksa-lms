export type SortOption = 'top-rated' | 'most-students' | 'newest';

export interface Teacher {
  id: string;
  name: string;
  title: string;
  image?: string;
  rating: number;
  studentsCount: number;
  subjectId: string;
  subjectLabel: string;
}

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}
