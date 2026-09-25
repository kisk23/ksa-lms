import { Users } from 'lucide-react';

import type { CourseDetails } from '@/features/courses/types';

interface CourseInfoProps {
  course: CourseDetails;
}

export default function CourseInfo({ course }: CourseInfoProps) {
  const totalLessons = course.chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => !l.isArchived).length,
    0,
  );

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Status badge */}
      <div className="flex items-center gap-2 flex-wrap">
        {course.status === 'PUBLISHED' && (
          <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-semibold border border-green-500/20">
            منشور
          </span>
        )}
        {course.status === 'DRAFT' && (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-sm font-semibold border border-amber-500/20">
            مسودة
          </span>
        )}
        <span className="px-3 py-1 bg-primary/10 text-primary  rounded-full text-sm font-semibold border border-primary /20">
          {course.chapters.length} فصل • {totalLessons} درس
        </span>
        {course.category && (
          <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-semibold border border-green-500/20">
            {course.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-black leading-tight">{course.title}</h1>

      {/* Description */}
      {course.description && (
        <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-6 mt-3">
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-surface-hover border-2 border-border flex items-center justify-center text-sm font-bold text-text">
            {course.teacher.name.charAt(0)}
          </div>
          <span className="font-semibold text-black text-sm">{course.teacher.name}</span>
        </div>

        {/* Students — _count is only returned by the list endpoint, so render
            the stat only when the API actually provided it */}
        {course._count?.enrollments !== undefined && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users size={18} className="text-gray-700" />
            <span className="text-sm">
              {course._count.enrollments.toLocaleString('ar-SA')} طالب مسجل
            </span>
          </div>
        )}
      </div>

      <hr className="border-gray-300" />

      {/* About */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-3">عن الدورة</h2>
        <p className="text-gray-600 leading-relaxed">
          {course.description ?? 'لا يوجد وصف متاح لهذه الدورة حتى الآن.'}
        </p>
      </div>
    </div>
  );
}
