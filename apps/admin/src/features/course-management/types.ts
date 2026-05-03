export type CourseStatus = 'active' | 'suspended' | 'pending' | 'deleted';

export type Course = {
  id: string;
  name: string;
  imageUrl?: string;
  teacher: string;
  price: number | null; // null = free
  studentsCount: number;
  rating: number | null;
  status: CourseStatus;
  createdAt: string;
};

export type CourseStatusFilter = 'all' | CourseStatus;
export type PriceRangeFilter = 'all' | 'free' | 'lt100' | 'gt100';
export type SubjectFilter = string;
export type TeacherFilter = string;

export type CoursesFiltersState = {
  subject: SubjectFilter;
  teacher: TeacherFilter;
  status: CourseStatusFilter;
  priceRange: PriceRangeFilter;
};
