'use client';

import { BookOpen, Check, Clock, DollarSign, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { CourseSuccessViewProps } from '../types';

export function CourseSuccessView({ createdCourse, onReset }: CourseSuccessViewProps) {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1rem' }}>
      <div
        style={{ width: '100%' }}
        className="bg-surface border border-outline-variant rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
      >
        {/* Top colored aesthetic bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-l from-primary to-primary-container" />

        {/* Success Animated Badge */}
        <div
          className="rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center shadow-inner animate-pulse"
          style={{ width: '5rem', height: '5rem', margin: '0 auto 2rem auto' }}
        >
          <Check size={36} className="stroke-[3.5]" />
        </div>

        <h2
          className="font-h1-ar text-2xl md:text-3xl font-bold text-on-surface text-center"
          style={{ marginBottom: '0.75rem' }}
        >
          تم إنشاء الدورة بنجاح!
        </h2>

        <p
          className="font-body-md-ar text-on-surface-variant text-center leading-relaxed"
          style={{ marginBottom: '2rem', paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          لقد تم تسجيل الدورة الجديدة «{createdCourse.title}» في النظام كمسودة (Draft). يمكنك الآن
          البدء في إضافة الفصول والدروس إليها.
        </p>

        {/* Course Details Card */}
        <div
          className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 space-y-4 shadow-sm"
          style={{ maxWidth: '32rem', margin: '0 auto 2.5rem auto' }}
        >
          <div className="flex justify-between items-center py-1">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              اسم الدورة
            </span>
            <span
              className="font-body-md-ar font-bold text-on-surface"
              style={{ maxWidth: '280px', textAlign: 'left' }}
            >
              {createdCourse.title}
            </span>
          </div>

          <div className="border-b border-outline-variant/30" />

          <div className="flex justify-between items-center py-1">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <User size={18} className="text-primary" />
              المعلم المسؤول
            </span>
            <span className="font-body-md-ar font-medium text-on-surface">
              {createdCourse.teacherName}
            </span>
          </div>

          <div className="border-b border-outline-variant/30" />

          <div className="flex justify-between items-center py-1">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              السعر والعملة
            </span>
            <span className="font-body-md-ar font-bold text-primary-container">
              {createdCourse.price === 0
                ? 'مجاني'
                : `${createdCourse.price} ${createdCourse.currency}`}
            </span>
          </div>

          <div className="border-b border-outline-variant/30" />

          <div className="flex justify-between items-center py-1">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              حالة الدورة
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F0FE] text-[#1967D2]">
              مسودة (Draft)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4" style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <button
            onClick={() => router.push(`/courses/${createdCourse.id}`)}
            className="w-full py-4 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl font-body-md-ar text-body-md-ar font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md shadow-primary/25 cursor-pointer"
          >
            <span>بناء منهج الدورة (الوحدات والدروس)</span>
            <Plus size={20} />
          </button>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <button
              onClick={() => router.push('/courses')}
              className="flex-1 py-3.5 bg-surface-container border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              العودة لقائمة الدورات
            </button>

            <button
              onClick={onReset}
              className="flex-1 py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              إضافة كورس آخر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
