// ─────────────────────────────────────────
// Course Management Feature
// ─────────────────────────────────────────
// Export components, hooks, services as built
export { CoursesHeader } from './components/CoursesHeader';
export { CoursesFilters } from './components/CoursesFilters';
export { CoursesTable } from './components/CoursesTable';
export { CourseCard } from './components/CourseCard';
export { CreateCourseForm } from './components/CreateCourseForm';
export { MOCK_COURSES } from './data/mock-courses';
export type {
  Course,
  CourseStatus,
  CourseStatusFilter,
  PriceRangeFilter,
  SubjectFilter,
  TeacherFilter,
} from './types';
