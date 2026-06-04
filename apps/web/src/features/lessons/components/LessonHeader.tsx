import type { LessonDetail } from '../types';

interface LessonHeaderProps {
  lesson: LessonDetail;
  courseTitle: string;
}

/**
 * LessonHeader
 *
 * Displays the lesson title, a course breadcrumb tag, and metadata
 * (lesson version — useful when teachers update content).
 */
export function LessonHeader({ lesson, courseTitle }: LessonHeaderProps) {
  return (
    <div className="flex flex-col gap-2" dir="rtl">
      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20">
          {courseTitle}
        </span>
        {lesson.progress?.isCompleted && (
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1">
            ✅ مكتمل
          </span>
        )}
        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
          الإصدار {lesson.version}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {lesson.title}
      </h1>
    </div>
  );
}
