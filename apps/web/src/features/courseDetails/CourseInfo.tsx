import { Users } from 'lucide-react';

import type { CourseDetails } from '@/features/courses/types';

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

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
          <span className="px-3 py-1 bg-[#1FC58E]/10 text-[#1FC58E] rounded-full text-sm font-semibold border border-[#1FC58E]/20">
            منشور
          </span>
        )}
        {course.status === 'DRAFT' && (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-sm font-semibold border border-amber-500/20">
            مسودة
          </span>
        )}
        <span className="px-3 py-1 bg-primary /10 text-primary  rounded-full text-sm font-semibold border border-primary /20">
          {10 + " Static"} فصل • {totalLessons} درس
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-text leading-tight">
        {course.title}
      </h1>

      {/* Description */}
      {course.description && (
        <p className="text-lg text-text-muted leading-relaxed">
          {course.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-6 mt-3">
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-surface-hover border-2 border-border flex items-center justify-center text-sm font-bold text-text">
            {course.teacher.name.charAt(0)}
          </div>
          <span className="font-semibold text-text text-sm">
            {course.teacher.name}
          </span>
        </div>

        {/* Enrollment count (no rating in schema yet — show enrollments instead) */}
        <div className="flex items-center gap-1 text-text-muted">
          <span className="text-amber-400">
            <StarIcon />
          </span>
          <span className="font-semibold text-text text-sm">جديد</span>
        </div>

        {/* Students */}
        <div className="flex items-center gap-1.5 text-text-muted">
          <Users size={18} />
          <span className="text-sm">
            {10 + " Static"} طالب مسجل
          </span>
        </div>
      </div>

      <hr className="border-border" />

      {/* About */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-3">عن الدورة</h2>
        <p className="text-text-muted leading-relaxed">
          {course.description ?? 'لا يوجد وصف متاح لهذه الدورة حتى الآن.'}
        </p>
      </div>
    </div>
  );
}