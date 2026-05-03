import { Rating } from '@shared/components/ui/Rating';
import {
  Eye,
  Pencil,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  RotateCcw,
  ImageIcon,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';

import type { Course, CourseStatus } from '../types';

type CourseRowProps = {
  course: Course;
};

const statusConfig: Record<CourseStatus, { label: string; bg: string; color: string }> = {
  active: { label: 'نشط', bg: 'bg-[#E6F4EA]', color: 'text-[#137333]' },
  suspended: { label: 'معلق', bg: 'bg-[#FEF7E0]', color: 'text-[#B06000]' },
  pending: { label: 'قيد الانتظار', bg: 'bg-[#E8F0FE]', color: 'text-[#1967D2]' },
  deleted: { label: 'محذوف', bg: 'bg-[#FCE8E6]', color: 'text-[#C5221F]' },
};

export function CourseRow({ course }: CourseRowProps) {
  const status = statusConfig[course.status];
  const isDeleted = course.status === 'deleted';
  const dim = isDeleted ? 'opacity-60' : '';

  return (
    <tr className="border-b border-surface-container-high hover:bg-surface transition-colors">
      {/* Image */}
      <td className={`p-4 ${dim}`}>
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.name}
            width={64}
            height={48}
            className="w-16 h-12 object-cover rounded-md border border-outline-variant"
          />
        ) : (
          <div className="w-16 h-12 bg-surface-container-high rounded-md flex items-center justify-center border border-outline-variant">
            <ImageIcon size={20} className="text-on-surface-variant" />
          </div>
        )}
      </td>

      {/* Name */}
      <td className={`p-4 ${dim}`}>
        <span
          className={`font-bold ${
            isDeleted ? 'text-on-surface-variant line-through' : 'text-primary-container'
          }`}
        >
          {course.name}
        </span>
      </td>

      <td className={`p-4 ${dim}`}>{course.teacher}</td>

      <td className={`p-4 ${dim}`}>{course.price === null ? 'مجاني' : `${course.price} ر.س`}</td>

      <td className={`p-4 ${dim}`}>{course.studentsCount}</td>

      <td className={`p-4 ${dim}`}>
        <Rating value={course.rating} />
      </td>

      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
        >
          {status.label}
        </span>
      </td>

      <td className={`p-4 text-on-surface-variant text-caption-ar font-caption-ar ${dim}`}>
        {course.createdAt}
      </td>

      <td className="p-4">
        <CourseActions status={course.status} />
      </td>
    </tr>
  );
}

// === Internal action buttons ===

function CourseActions({ status }: { status: CourseStatus }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {status === 'active' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={PauseCircle} title="تعليق" hoverColor="hover:text-[#B06000]" />
          <ActionButton icon={Trash2} title="حذف" hoverColor="hover:text-error" />
        </>
      )}

      {status === 'suspended' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={PlayCircle} title="تفعيل" hoverColor="hover:text-[#137333]" />
          <ActionButton icon={Trash2} title="حذف" hoverColor="hover:text-error" />
        </>
      )}

      {status === 'pending' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={CheckCircle2} title="قبول" hoverColor="hover:text-[#137333]" />
          <ActionButton icon={XCircle} title="رفض" hoverColor="hover:text-error" />
        </>
      )}

      {status === 'deleted' && <ActionButton icon={RotateCcw} title="استعادة" />}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  hoverColor = 'hover:text-primary-container',
}: {
  icon: LucideIcon;
  title: string;
  hoverColor?: string;
}) {
  return (
    <button title={title} className={`text-on-surface-variant transition-colors p-1 ${hoverColor}`}>
      <Icon size={20} />
    </button>
  );
}
