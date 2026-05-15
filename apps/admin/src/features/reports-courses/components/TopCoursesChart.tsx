import type { TopCourse } from '../types';

interface TopCoursesChartProps {
  courses: TopCourse[];
}

export function TopCoursesChart({ courses }: TopCoursesChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] p-6 mb-lg">
      <h2 className="font-h2-ar text-h2-ar text-[#0F172A] mb-6">أعلى 5 دورات مبيعاً (بالحجم)</h2>
      <div className="flex flex-col gap-5">
        {courses.map((course, index) => {
          const opacity = [1, 0.8, 0.6, 0.4, 0.2][index] || 0.2;
          return (
            <div key={course.title}>
              <div className="flex justify-between items-end mb-xs">
                <span className="font-body-md-ar text-body-md-ar font-medium text-[#0F172A]">
                  {course.title}
                </span>
                <span className="font-caption-ar text-sm text-[#64748B]">
                  {course.studentCount.toLocaleString('ar-SA')} طالب
                </span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div
                  className="bg-primary-container h-full rounded-full"
                  style={{ width: `${course.percentage}%`, opacity }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
