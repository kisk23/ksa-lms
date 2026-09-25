import type { Course } from '../types';
import { CourseCard } from './CourseCard';

interface CoursesGridProps {
  courses: Course[];
  isLoading?: boolean;
  isFetching?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
        <div className="h-8 w-full bg-gray-200 rounded mt-1" />
      </div>
    </div>
  );
}

export function CoursesGrid({ courses, isLoading, isFetching }: CoursesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-muted">
        <span className="text-5xl mb-4">📭</span>
        <p className="text-base">لا توجد دورات مطابقة للبحث</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${
        isFetching ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
