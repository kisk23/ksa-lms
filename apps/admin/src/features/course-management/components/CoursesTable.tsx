'use client';

import { Pagination } from '@shared/components/ui/Pagination';
import { useState, useMemo, useEffect } from 'react';

import { CourseCard } from './CourseCard';
import type { Course } from '../types';

type CoursesTableProps = {
  courses: Course[];
  pageSize?: number;
};

export function CoursesTable({ courses, pageSize = 6 }: CoursesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [courses]);

  const totalItems = courses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const visibleCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return courses.slice(start, start + pageSize);
  }, [courses, currentPage, pageSize]);

  return (
    <div className="flex flex-col gap-base">
      {visibleCourses.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center text-on-surface-variant font-body-md-ar shadow-sm">
          لا توجد نتائج مطابقة للفلاتر المحددة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-gutter">
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Standalone Premium Pagination Container */}
      {totalItems > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            itemLabel="كورس"
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
