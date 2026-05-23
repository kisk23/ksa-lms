'use client';

import {
  Eye,
  Pencil,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Archive,
  RotateCcw,
  Star,
  MoreVertical,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import type { Course, CourseStatus } from '../types';

type CourseCardProps = {
  course: Course;
};

const statusConfig: Record<CourseStatus, { label: string; bg: string; color: string }> = {
  active: { label: 'منشور', bg: 'bg-[#E6F4EA]', color: 'text-[#137333]' },
  pending: { label: 'قيد المراجعة', bg: 'bg-[#E8F0FE]', color: 'text-[#1967D2]' },
  suspended: { label: 'مؤرشف', bg: 'bg-[#FEF7E0]', color: 'text-[#B06000]' },
  deleted: { label: 'محذوف', bg: 'bg-[#FCE8E6]', color: 'text-[#C5221F]' },
};

function getTeacherInitials(name: string): string {
  const parts = name
    .replace(/^(د\.|أ\.|م\.)\s*/, '')
    .trim()
    .split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2);
  return (parts[0][0] || '') + (parts[parts.length - 1][0] || '');
}

function getCourseCoverImage(courseName: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;

  const lowerName = courseName.toLowerCase();
  if (lowerName.includes('رياضيات') || lowerName.includes('إحصاء') || lowerName.includes('حساب')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuACpYT5T6wlRu1dqr_yEEi_S9ImNPU_zFxXmFat8BEJj5tFkPDmOAPlijthKmxMxpUUcvJvZqu7WLiFO0IyMIsDwabX_RrkH07JWunMJu2WT37Vahig-6R3Leru8YRzaIFgiWLQPoernGKREX2IC6yo7hCJ7UHGfWmqzedyBRfePywRtncZe2rPmu2lUJ7Hu8fBJPvxpfrixOJHLX1kcTtZUaM_uP2nWchtewN3b2HmW2vCus1CmTYpA6slni7h1BsEwWTtEXZqC0PU';
  }
  if (lowerName.includes('فيزياء')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuChi9A9qojuA5_EfRQCEF8pqBD-_sd67mEvKszcUA8TnYEoTtVCOTKkxYiia2BhgbS2XpuRMNoVymakRw-Ns56PS-aeER3cxARJcc48CozPHY6QBTlUHijVNci-Ai3JP89_H9Bw_QExQNlQIspY79qVyzbPMCEoiGazUOq7Uo4RnWCaejGhCfgW5NO4C7BR3F433aRusaaqFzwLEUIFETNdjLZTVgggQrOT73z8e-FljUaq7yjVwvRNcVzr1Urq5Ca-tcJhR9PWAL91';
  }
  if (lowerName.includes('كيمياء')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLt8vveSyBkOFdKPgI7NZ2e4IvZt8gb8EI_tFsWnDG-QjBaUx0fYgG31ddQqBiJikctu9X17SJC6K0LC80JyjW2DKE_SD8d75pyossAnMHHHUVniWYBDlnko8qGYNTRATNYUE1vUh8kMY7snBPhqg3P-grZZm5fKgHdQ5YJwHqDRW3nW8EvDkBrAjZBpyaZbRtnQgZUBaFOf87mkJ7sVkxMHFtsrqIQP3FJHlTnBudd1nhDV_M6l7Hf6Dkn-HavM1H0oFnqdI35rwO';
  }
  return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLLQ5Fx3n2iaGTIl_3k05p_jIXWpF8X1IQdiC_wbjgLu2caqZeS8n3DAOEzEUFmfWxswrPGnzN5bhLMao_40f894zszr2Uwd85cxkLqj_ItIQ5W0vj5o3TIC0CSokVsaDLx82DFRSMJIx6M39Zz39XSAuxF9jXZPIKpkQRR6Vr2A2EzYES2_vdHYerIZ-jmkJf6171ijyRWqoo21HcH5HkwCbRgmVPY5bbKB1DppGWLYPbNrvryfhMe7X8LatVVeCovbXOCpYTgpr4';
}

function getCourseTag(courseName: string): string {
  const name = courseName.toLowerCase();
  if (name.includes('رياضيات') || name.includes('إحصاء') || name.includes('حساب')) {
    return 'رياضيات | الثالث الثانوي';
  }
  if (name.includes('فيزياء')) {
    return 'فيزياء | العام الجامعي';
  }
  if (name.includes('كيمياء')) {
    return 'كيمياء | الثالث الثانوي';
  }
  if (name.includes('أحياء')) {
    return 'أحياء | الصف الأول الثانوي';
  }
  if (name.includes('إنجليزية') || name.includes('english')) {
    return 'لغات | المستوى المتقدم';
  }
  if (name.includes('برمجة') || name.includes('بايثون') || name.includes('python')) {
    return 'تقنية | الصف الأول الثانوي';
  }
  if (name.includes('تصميم') || name.includes('جرافيك') || name.includes('ui')) {
    return 'فنون | المرحلة الثانوية';
  }
  if (name.includes('مهارات') || name.includes('تفكير')) {
    return 'مهارات | الصف الثاني الثانوي';
  }
  return 'عام | دورة تدريبية';
}

export function CourseCard({ course }: CourseCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const status = statusConfig[course.status] || statusConfig.active;
  const isDeleted = course.status === 'deleted';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const initials = getTeacherInitials(course.teacher);
  const coverUrl = getCourseCoverImage(course.name, course.imageUrl);
  const courseTag = getCourseTag(course.name);

  // Show a headshot if the teacher is one of the primary ones
  const showHeadshot =
    course.teacher.includes('أحمد') ||
    course.teacher.includes('سارة') ||
    course.teacher.includes('إبراهيم') ||
    course.teacher.includes('فهد');

  const teacherAvatarUrl = showHeadshot
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLLQ5Fx3n2iaGTIl_3k05p_jIXWpF8X1IQdiC_wbjgLu2caqZeS8n3DAOEzEUFmfWxswrPGnzN5bhLMao_40f894zszr2Uwd85cxkLqj_ItIQ5W0vj5o3TIC0CSokVsaDLx82DFRSMJIx6M39Zz39XSAuxF9jXZPIKpkQRR6Vr2A2EzYES2_vdHYerIZ-jmkJf6171ijyRWqoo21HcH5HkwCbRgmVPY5bbKB1DppGWLYPbNrvryfhMe7X8LatVVeCovbXOCpYTgpr4'
    : null;

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-outline-variant overflow-hidden flex flex-col hover:shadow-md transition-shadow relative ${isDeleted ? 'opacity-75' : ''}`}
    >
      {/* Cover Image and Badge */}
      <div className="relative h-48 w-full">
        <Image
          src={coverUrl}
          alt={course.name}
          fill
          className="object-cover rounded-t-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
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
            {course.name}
          </h3>
          <div className="inline-block bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs mt-2 font-caption-ar">
            {courseTag}
          </div>
        </div>

        {/* Teacher & Rating */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3">
            {teacherAvatarUrl ? (
              <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden relative">
                <Image
                  src={teacherAvatarUrl}
                  alt={course.teacher}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden bg-surface-container flex items-center justify-center font-bold text-primary font-caption-ar text-sm select-none">
                {initials}
              </div>
            )}
            <span className="text-sm text-on-surface-variant font-body-md-ar font-medium">
              {course.teacher}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 text-secondary ${!course.rating ? 'opacity-50' : ''}`}
          >
            <Star size={18} className={course.rating ? 'fill-current' : ''} />
            <span className="font-bold text-sm">
              {course.rating ? course.rating.toFixed(1) : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer and Actions Dropdown */}
      <div className="px-6 py-4 border-t border-surface-container flex items-center justify-between bg-surface-container-lowest/50 relative">
        <span className="text-lg font-bold text-primary">
          {course.price === null ? 'مجاني' : `${course.price} ر.س`}
        </span>

        {/* Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-primary-container font-bold text-sm hover:bg-primary-fixed px-4 py-2 rounded-lg transition-colors border border-primary-container/10 flex items-center gap-1.5 active:scale-95 duration-100 cursor-pointer"
          >
            <span>إدارة الكورس</span>
            <MoreVertical size={14} className="opacity-70" />
          </button>

          {/* Absolute Actions Menu */}
          {dropdownOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-outline-variant p-2 z-50 flex flex-col gap-1 transition-all animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-2 py-1 text-xs text-on-surface-variant border-b border-surface-container mb-1 font-caption-ar">
                الخيارات المتاحة
              </div>

              {course.status === 'active' && (
                <>
                  <DropdownItem icon={Eye} label="عرض الكورس" />
                  <DropdownItem icon={Pencil} label="تعديل البيانات" />
                  <DropdownItem
                    icon={PauseCircle}
                    label="تعليق مؤقت"
                    hoverClass="hover:bg-amber-50 hover:text-amber-700"
                  />
                  <DropdownItem
                    icon={Archive}
                    label="أرشفة الكورس"
                    hoverClass="hover:bg-red-50 hover:text-red-700"
                  />
                </>
              )}

              {course.status === 'suspended' && (
                <>
                  <DropdownItem icon={Eye} label="عرض الكورس" />
                  <DropdownItem icon={Pencil} label="تعديل البيانات" />
                  <DropdownItem
                    icon={PlayCircle}
                    label="تفعيل ونشر"
                    hoverClass="hover:bg-emerald-50 hover:text-emerald-700"
                  />
                  <DropdownItem
                    icon={Archive}
                    label="أرشفة الكورس"
                    hoverClass="hover:bg-red-50 hover:text-red-700"
                  />
                </>
              )}

              {course.status === 'pending' && (
                <>
                  <DropdownItem icon={Eye} label="عرض الكورس" />
                  <DropdownItem icon={Pencil} label="تعديل البيانات" />
                  <DropdownItem
                    icon={CheckCircle2}
                    label="قبول ونشر"
                    hoverClass="hover:bg-emerald-50 hover:text-emerald-700"
                  />
                  <DropdownItem
                    icon={XCircle}
                    label="رفض الطلب"
                    hoverClass="hover:bg-red-50 hover:text-red-700"
                  />
                </>
              )}

              {course.status === 'deleted' && (
                <DropdownItem
                  icon={RotateCcw}
                  label="استعادة الكورس"
                  hoverClass="hover:bg-blue-50 hover:text-blue-700"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Internal Dropdown Item Component
type DropdownItemProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  hoverClass?: string;
};

function DropdownItem({
  icon: Icon,
  label,
  onClick,
  hoverClass = 'hover:bg-surface-container hover:text-primary',
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors w-full text-right font-medium text-on-surface-variant cursor-pointer ${hoverClass}`}
    >
      <Icon size={16} className="opacity-80" />
      <span>{label}</span>
    </button>
  );
}
