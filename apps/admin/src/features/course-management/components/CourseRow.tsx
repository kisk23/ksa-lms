import { formatDate } from '@shared/lib/formatters';
import {
  Eye,
  Pencil,
  Archive,
  RotateCcw,
  ImageIcon,
  Upload,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';

import { statusConfig } from '../constants';
import type { CourseRowProps, CourseStatus } from '../types';

export function CourseRow({ course }: CourseRowProps) {
  const status = statusConfig[course.status];
  const isArchived = course.status === 'ARCHIVED';
  const dim = isArchived ? 'opacity-60' : '';
  const price = parseFloat(course.price);

  return (
    <tr className="border-b border-surface-container-high hover:bg-surface transition-colors">
      {/* Image */}
      <td className={`p-4 ${dim}`}>
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            width={64}
            height={48}
            className="object-cover rounded-md border border-outline-variant"
            unoptimized
          />
        ) : (
          <div className="w-16 h-12 bg-surface-container-high rounded-md flex items-center justify-center border border-outline-variant">
            <ImageIcon size={20} className="text-on-surface-variant" />
          </div>
        )}
      </td>

      {/* Title */}
      <td className={`p-4 ${dim}`}>
        <span
          className={`font-bold ${
            isArchived ? 'text-on-surface-variant line-through' : 'text-primary-container'
          }`}
        >
          {course.title}
        </span>
      </td>

      <td className={`p-4 ${dim}`}>{course.teacher.name}</td>

      <td className={`p-4 ${dim}`}>
        {price === 0 ? 'مجاني' : `${price} ${course.currency === 'SAR' ? 'ر.س' : course.currency}`}
      </td>

      <td className={`p-4 ${dim}`}>{course._count.enrollments}</td>

      <td className={`p-4 ${dim}`}>{course._count.chapters} فصول</td>

      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
        >
          {status.label}
        </span>
      </td>

      <td className={`p-4 text-on-surface-variant text-caption-ar font-caption-ar ${dim}`}>
        {formatDate(course.createdAt)}
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
      {status === 'DRAFT' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={Upload} title="تقديم للمراجعة" hoverColor="hover:text-[#1967D2]" />
        </>
      )}

      {status === 'PENDING_REVIEW' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={CheckCircle2} title="قبول" hoverColor="hover:text-[#137333]" />
          <ActionButton
            icon={AlertTriangle}
            title="طلب تعديلات"
            hoverColor="hover:text-[#B06000]"
          />
        </>
      )}

      {status === 'CHANGES_REQUESTED' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={Upload} title="إعادة تقديم" hoverColor="hover:text-[#1967D2]" />
        </>
      )}

      {status === 'PUBLISHED' && (
        <>
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />
          <ActionButton icon={Archive} title="أرشفة" hoverColor="hover:text-error" />
        </>
      )}

      {status === 'ARCHIVED' && (
        <ActionButton icon={RotateCcw} title="استعادة" hoverColor="hover:text-[#1967D2]" />
      )}
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
