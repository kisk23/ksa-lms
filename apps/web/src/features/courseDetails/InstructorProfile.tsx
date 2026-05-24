import { GraduationCap } from 'lucide-react';

import type { Instructor } from '@/features/courses/types';

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

interface InstructorProfileProps {
  teacher: Instructor;
  /** Total courses taught by this teacher — pass course._count if available */
  courseCount?: number;
}

export default function InstructorProfile({ teacher, courseCount }: InstructorProfileProps) {
  // Initials avatar — backend doesn't store a profile photo yet
  const initials = teacher.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('');

  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold text-black mb-3">المحاضر</h2>
      <div className="flex flex-col sm:flex-row gap-6 p-6 shadow-sm border-2 border-gray-300 rounded-xl ">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-gray-300 shrink-0 flex items-center justify-center text-2xl font-bold text-primary  select-none">
          {initials}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-black">{teacher.name}</h3>
          <p className="text-sm text-primary  font-semibold">محاضر معتمد في منصة سُلَّم</p>

          <div className="flex items-center gap-5 mt-1">
            <div className="flex items-center gap-1 text-gray-600">
              <span className="text-amber-400">
                <StarIcon />
              </span>
              <span className="text-xs">محاضر معتمد</span>
            </div>
            {courseCount !== undefined && (
              <div className="flex items-center gap-1 text-gray-600">
                <GraduationCap size={16} strokeWidth={2} className='text-gray-700'/>
                <span className="text-xs">{courseCount + " Static"} دورة</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mt-1">
            معلم متخصص يقدم محتوى تعليمياً عالي الجودة عبر منصة سُلَّم. يركز على تبسيط المفاهيم
            وربطها بالتطبيق العملي لضمان أفضل تجربة تعلم للطلاب.
          </p>
        </div>
      </div>
    </div>
  );
}