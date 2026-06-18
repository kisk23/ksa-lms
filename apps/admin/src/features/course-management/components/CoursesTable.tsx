'use client';

import { Pagination } from '@shared/components/ui/Pagination';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';

import { CourseCard } from './CourseCard';
import type { CoursesTableProps } from '../types';

export function CoursesTable({
  courses,
  isLoading,
  error,
  meta,
  currentPage,
  onPageChange,
  onRetry,
  onRefresh,
}: CoursesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-16 text-center shadow-sm">
        <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
        <p className="font-body-md-ar text-on-surface-variant">جاري تحميل الكورسات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-error/20 p-12 text-center shadow-sm">
        <AlertCircle size={40} className="text-error mx-auto mb-4" />
        <p className="font-body-md-ar text-error font-semibold mb-2">فشل في تحميل الكورسات</p>
        <p className="font-caption-ar text-on-surface-variant mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary-container text-on-primary rounded-xl hover:bg-primary transition-colors font-body-md-ar font-semibold"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-base">
      {courses.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center shadow-sm">
          <BookOpen size={48} className="mx-auto mb-4 text-outline/40" />
          <p className="font-body-md-ar text-on-surface-variant font-semibold mb-1">
            لا توجد كورسات
          </p>
          <p className="font-caption-ar text-on-surface-variant/70">
            لا توجد نتائج مطابقة للفلاتر المحددة، جرب تعديل معايير البحث.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-gutter">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onRefresh={onRefresh} />
          ))}
        </div>
      )}

      {/* Pagination from API meta */}
      {meta && meta.total > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            pageSize={meta.limit}
            itemLabel="كورس"
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
