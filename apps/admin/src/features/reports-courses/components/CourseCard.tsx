import { User, Users, DollarSign } from 'lucide-react';
import Image from 'next/image';

import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Course Image */}
      <div className="aspect-video w-full relative">
        <Image alt={course.title} src={course.image} fill className="object-cover" unoptimized />
        <div className="absolute top-sm right-sm bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-caption-ar text-sm font-medium text-primary-container border border-slate-200">
          {course.categoryAr}
        </div>
      </div>

      {/* Course Info */}
      <div className="p-md flex-1 flex flex-col">
        <h3 className="font-h2-ar text-h2-ar font-semibold text-[#0F172A] mb-2 leading-tight">
          {course.title}
        </h3>
        <p className="font-body-md-ar text-sm text-[#64748B] flex items-center gap-2 mb-6">
          <User className="w-4 h-4" />
          {course.instructor}
        </p>

        {/* Stats */}
        <div className="mt-auto pt-md border-t border-surface-container-high grid grid-cols-2 gap-sm">
          {/* Student Count */}
          <div>
            <span className="block font-caption-ar text-[12px] text-on-surface-variant mb-1">
              الوحدات المباعة
            </span>
            <span className="font-body-md-ar font-semibold text-on-surface flex items-center gap-xs">
              <Users className="w-[18px] h-[18px] text-primary-container" />
              {course.studentCount.toLocaleString('ar-SA')} طالب
            </span>
          </div>

          {/* Revenue */}
          <div>
            <span className="block font-caption-ar text-[12px] text-on-surface-variant mb-1">
              إجمالي الإيرادات
            </span>
            <span className="font-body-md-ar font-semibold text-secondary-container flex items-center gap-xs">
              <DollarSign className="w-[18px] h-[18px]" />
              {course.totalRevenue.toLocaleString('ar-SA')} ر.س
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
