import Link from 'next/link';

import type { Course } from '../types';
import Image from 'next/image';
import { Clock, UserRound } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const numericPrice = Number(course.price);
  const formattedPrice =
    numericPrice === 0 ? 'مجاني' : `${numericPrice.toLocaleString('ar-SA')} ${course.currency}`;

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden flex items-center justify-center">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-4xl">📚</span>
        )}
        {/* Rating badge placeholder */}
        <div className="absolute top-2 right-2 bg-white backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span className="font-medium">جديد</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col grow gap-2">
        {/* Chapter count badge */}
        <div className="flex gap-1 flex-wrap">
          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
            {course.slug}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-black text-3xl leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-surface/80 text-sm line-clamp-2">
          {course.description?.slice(0, 50) || 'لا توجد وصف'}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-1.5 text-surface/80 text-xs mt-auto pt-3">
          <UserRound />
          <span>{course.teacher.name}</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-border/20">
          <span className="text-surface/80 text-xs flex items-center gap-1">
            <Clock size={16} />
            <span>{course._count.enrollments.toLocaleString('ar-SA')} طالب</span>
          </span>
          <span className="text-primary font-bold text-sm">{formattedPrice}</span>
        </div>

        <button
          tabIndex={-1}
          className="mt-1 w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded-sm text-xs font-semibold cursor-pointer"
        >
          عرض التفاصيل
        </button>
      </div>
    </Link>
  );
}
