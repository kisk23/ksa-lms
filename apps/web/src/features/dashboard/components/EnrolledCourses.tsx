'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calculator, Atom, GraduationCap, CheckCircle, ChevronLeft } from 'lucide-react';
import type { StudentEnrollment } from '../types';
import { EnrolledCourseCard } from './EnrolledCourseCard';

interface EnrolledCoursesProps {
  courses: StudentEnrollment[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
}

function getCategoryIcon(category: string | null) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('رياضيات') || cat.includes('math') || cat.includes('حساب')) {
    return <Calculator className="text-xl" size={24} />;
  }
  if (
    cat.includes('فيزياء') ||
    cat.includes('علوم') ||
    cat.includes('physics') ||
    cat.includes('science') ||
    cat.includes('كيمياء') ||
    cat.includes('أحياء')
  ) {
    return <Atom className="text-xl" size={24} />;
  }
  if (
    cat.includes('عرب') ||
    cat.includes('لغ') ||
    cat.includes('قرآن') ||
    cat.includes('إسلام') ||
    cat.includes('arabic')
  ) {
    return <BookOpen className="text-xl" size={24} />;
  }
  return <GraduationCap className="text-xl" size={24} />;
}

export function EnrolledCourses({ courses, isLoading, viewMode }: EnrolledCoursesProps) {
  if (isLoading) {
    if (viewMode === 'list') {
      return (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden animate-pulse">
          <div className="h-14 bg-surface-container-low border-b border-outline-variant" />
          <div className="divide-y divide-outline-variant/30">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-white" />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[420px]"
          />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest border border-outline-variant rounded-2xl text-center p-8 shadow-sm"
        dir="rtl"
      >
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-primary-fixed-dim mb-4">
          <BookOpen size={28} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-1">لا توجد دورات مسجلة بعد</h3>
        <p className="text-on-surface-variant text-sm max-w-sm mb-6 font-medium">
          لم تقم بالاشتراك في أي دورات تعليمية حتى الآن. ابدأ رحلتك التعليمية واستكشف دوراتنا
          المميزة!
        </p>
        <a
          href="/courses"
          className="bg-primary text-white hover:bg-primary-hover px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 shadow-[0_4px_14px_rgba(0,45,155,0.25)] no-underline hover:no-underline"
        >
          تصفح الدورات المتاحة
        </a>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div
        className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_24px_-8px_rgba(22,33,62,0.08)] overflow-hidden font-sans text-right"
        dir="rtl"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low border-b border-outline-variant text-on-surface-variant text-xs font-semibold">
          <div className="col-span-12 md:col-span-4">اسم المادة</div>
          <div className="hidden md:block col-span-2">المعلم</div>
          <div className="hidden md:block col-span-2 text-center">نسبة الإنجاز</div>
          <div className="hidden md:block col-span-1 text-center">الحالة</div>
          <div className="hidden lg:block col-span-2 text-center">آخر دخول</div>
          <div className="hidden md:block col-span-1 text-center"></div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col divide-y divide-outline-variant/30 bg-white">
          {courses.map((enrollment) => {
            const course = enrollment.course;
            const progress = enrollment.progress;
            const progressPct = progress?.progressPct ?? 0;
            const isCompleted = enrollment.status === 'COMPLETED' || progressPct >= 100;
            const completedCount = progress?.completedLessons ?? 0;
            const totalCount = progress?.totalLessons ?? 0;

            // Determine status details
            let statusText = 'مستمر';
            let statusClass = 'bg-primary-fixed text-on-primary-fixed';
            if (isCompleted) {
              statusText = 'مكتمل';
              statusClass =
                'bg-secondary-container text-on-secondary-container flex items-center justify-center gap-1';
            } else if (progressPct < 20) {
              statusText = 'متأخر';
              statusClass = 'bg-error-container text-on-error-container';
            }

            // Determine category colors
            const isMath =
              (course.category || '').includes('رياضيات') || course.title.includes('الرياضيات');
            const isPhysics =
              (course.category || '').includes('فيزياء') || course.title.includes('الفيزياء');

            let iconContainerClass = 'bg-tertiary-fixed-dim/30 text-tertiary-fixed-dim';
            if (isMath) {
              iconContainerClass = 'bg-surface-tint/10 text-primary';
            } else if (isPhysics) {
              iconContainerClass = 'bg-secondary-container/30 text-secondary';
            }

            return (
              <div
                key={enrollment.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-surface-container-low/50 transition-colors group bg-white"
              >
                {/* Course Info */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconContainerClass}`}
                  >
                    {getCategoryIcon(course.category || course.title)}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 md:hidden font-medium">
                      {course.teacher.name} • {progressPct}% مكتمل
                    </p>
                  </div>
                </div>

                {/* Instructor */}
                <div className="hidden md:flex col-span-2 items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden shrink-0">
                    <Image
                      alt="صورة المعلم"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbb_O8nMC--pDgaHloeN4SRzjQHKLMeuAt989rNTULijxVQarhkObo5fjvs2_rjKYJ7cELhG1zFvaXD6XQ5VvOVm5yWoCMcfjAIyZPfsKFysUdOmwp8xczanQSRQwMDKcBDrg4ezg6ZtMSGH8MEvZDqE2th__7Co2vRPAfL_61GkkUusfAoPGWb2j6AzVHp_hbMHwZTscid0SGKU7ssNd0T059-nP77gBnlgfkppYXzX2KH6poU3Kpd5wrWfbbaU6bnM9bIvJv0IsL"
                    />
                  </div>
                  <span className="text-sm font-semibold text-on-surface">
                    {course.teacher.name}
                  </span>
                </div>

                {/* Progress */}
                <div className="hidden md:flex col-span-2 flex-col justify-center px-4">
                  <div className="flex justify-between items-center mb-1.5 text-xs text-on-surface-variant font-medium">
                    <span>{progressPct}%</span>
                    <span>
                      {completedCount}/{totalCount} درس
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500
                        ${isCompleted ? 'bg-secondary' : 'bg-primary'}
                      `}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="hidden md:flex col-span-1 justify-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${statusClass}`}
                  >
                    {isCompleted && <CheckCircle size={12} className="shrink-0" />}
                    <span>{statusText}</span>
                  </span>
                </div>

                {/* Last Access */}
                <div className="hidden lg:flex col-span-2 justify-center">
                  <span className="text-xs text-on-surface-variant font-semibold">قبل ساعتين</span>
                </div>

                {/* Action */}
                <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center mt-3 md:mt-0">
                  {isCompleted ? (
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="w-full md:w-auto bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 no-underline hover:no-underline"
                    >
                      <span>مراجعة</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="w-full md:w-auto bg-primary text-on-primary hover:bg-surface-tint px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 no-underline hover:no-underline whitespace-nowrap"
                    >
                      <span>استكمال</span>
                      <ChevronLeft size={14} className="text-white" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
      {courses.map((enrollment) => (
        <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}
