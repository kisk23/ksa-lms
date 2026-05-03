'use client';

import { Pagination } from '@shared/components/ui/Pagination';
import { useState, useMemo, useEffect } from 'react';

import { CourseRow } from './CourseRow';
import type { Course } from '../types';

type CoursesTableProps = {
  courses: Course[];
  pageSize?: number;
};

const columns = [
  'الصورة',
  'اسم الكورس',
  'المعلم',
  'السعر',
  'الطلاب',
  'التقييم',
  'الحالة',
  'تاريخ الإنشاء',
];

export function CoursesTable({ courses, pageSize = 4 }: CoursesTableProps) {
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
    <div className="bg-surface-container-lowest rounded-xl shadow-card-soft border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-caption-ar text-caption-ar">
              {columns.map((col) => (
                <th key={col} className="p-4 font-semibold">
                  {col}
                </th>
              ))}
              <th className="p-4 font-semibold text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="font-body-md-ar text-body-md-ar text-on-surface">
            {visibleCourses.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-on-surface-variant font-caption-ar"
                >
                  لا توجد نتائج مطابقة للفلاتر المحددة
                </td>
              </tr>
            ) : (
              visibleCourses.map((course) => <CourseRow key={course.id} course={course} />)
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="كورس"
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
