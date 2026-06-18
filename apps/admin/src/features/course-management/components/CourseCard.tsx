'use client';

import { getTeacherInitials, formatDate } from '@shared/lib/formatters';
import { BookOpen, Users, ImageIcon } from 'lucide-react';
import Image from 'next/image';

import type { CourseCardProps } from '../types';
import { CourseActionsDropdown } from './CourseActionsDropdown';
import { statusConfig } from '../constants';

export function CourseCard({ course, onRefresh }: CourseCardProps) {
  const status = statusConfig[course.status] || statusConfig.DRAFT;
  const isArchived = course.status === 'ARCHIVED';
  const price = parseFloat(course.price);
  const initials = getTeacherInitials(course.teacher?.name || '');

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-outline-variant overflow-hidden flex flex-col hover:shadow-md transition-shadow relative ${isArchived ? 'opacity-75' : ''}`}
    >
      {/* Cover Image and Badge */}
      <div className="relative h-48 w-full">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover rounded-t-2xl"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-container/15 via-primary/5 to-surface-container flex items-center justify-center">
            <ImageIcon size={48} className="text-outline/30" />
          </div>
        )}
        <div
          className={`absolute top-4 left-4 ${status.bg} ${status.color} px-3 py-1 rounded-full text-xs font-bold font-caption-ar shadow-sm z-10`}
        >
          {status.label}
        </div>
      </div>

      {/* Main Info */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold text-on-surface font-h2-ar leading-tight line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>
          {course.category && (
            <div className="inline-block bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs mt-2 font-caption-ar">
              {course.category}
            </div>
          )}
        </div>

        {/* Teacher & Stats */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden bg-surface-container flex items-center justify-center font-bold text-primary font-caption-ar text-sm select-none">
              {initials}
            </div>
            <span className="text-sm text-on-surface-variant font-body-md-ar font-medium">
              {course.teacher?.name || 'غير معروف'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-on-surface-variant">
            <div className="flex items-center gap-1 text-xs" title="عدد الطلاب">
              <Users size={14} />
              <span>{course._count.enrollments}</span>
            </div>
            <div className="flex items-center gap-1 text-xs" title="عدد الفصول">
              <BookOpen size={14} />
              <span>{course._count.chapters}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-surface-container flex items-center justify-between bg-surface-container-lowest/50 relative">
        <div>
          <span className="text-lg font-bold text-primary">
            {price === 0
              ? 'مجاني'
              : `${price} ${course.currency === 'SAR' ? 'ر.س' : course.currency}`}
          </span>
          <div className="text-[10px] text-on-surface-variant/60 mt-0.5">
            {formatDate(course.createdAt)}
          </div>
        </div>

        <CourseActionsDropdown course={course} onRefresh={onRefresh} />
      </div>
    </div>
  );
}
