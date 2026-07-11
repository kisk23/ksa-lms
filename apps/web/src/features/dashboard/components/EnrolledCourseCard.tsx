'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserRound, Award, History, ArrowRight, RotateCcw } from 'lucide-react';
import type { StudentEnrollment } from '../types';

interface EnrolledCourseCardProps {
  enrollment: StudentEnrollment;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { course, status, progress } = enrollment;

  // Calculate progress details
  const progressPct = progress?.progressPct ?? 0;
  const completedLessons = progress?.completedLessons ?? 0;
  const lastLesson = progress?.lastLesson;

  const isCompleted = status === 'COMPLETED' || progressPct >= 100;
  const xpAwarded = completedLessons * 50; // 50 XP per completed lesson

  // Encouragement text
  let encouragementText = 'البداية هي نصف الطريق، استمر! 🚀';
  if (isCompleted) {
    encouragementText = 'عمل رائع! لقد أتممت الكورس بنجاح. 🌟';
  } else if (progressPct > 0) {
    encouragementText = `أكملت ${progressPct}% من هذا الكورس! 🔥`;
  }

  // Cover image fallback
  const fallbackImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAEKlaBcraNCI609YkgWg66jEnnO6m14QacgXDUWnNu1KL-WK-dDtfZAgxMNArpS2m-yTe0RW_NtQ3r3GLMrWoGD1ofzr81FAtZ61wLK4jIVmOvyQxstmj_nAce4bwxoECYfEI_Gn37ulA0CtxdOmwXoxu_R5c7Id4OZhwsgJAGvdCcv7WTjuFr19mjWXc2aq45DyctrI7hVgwrobOWC-iGaI8_Dk29PMABp_PwDRN6IsbY9rwJWQnAVMx3xs1T14h1G4OzU8nR6Cmh', // math
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAu9egpajXgy0hW_JYICWqy-Fs8nVJTEItmaKbrrhD-UzJtllSmkSMPA90_oiJ98ywg7Ny8CS30b-h6VzH4DcGk8Ccc8CeF8V5tgHOTOwuEp0vzqGY9wNJAHWgnSQkdDp_wX-10mQtCAG5Yrv1VUyKUtKfnqefUbqHY6ym97ZemCXmLVdVxDbwITiC3rBF5Xe-OhgUE2ZAi3t9wEPh09v-8n3HUIS_hEm_ou-_wFlVtlDG7Np8DG_gpLIKuPZGKbI-zco9EuJx-c32E', // chemistry
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCOFmiyMr_hHhzuPrLovt145718pSGe6EN17nLkD6xtg-q551xZlLS3tV9G7KVh6dTiGPb3vf5iGjnfYhPZepY8D-s9aMvlF_JK-mkztUmj6cyO0QR_kif7Rmee-XZB9ghDn-EMg_gQFVUb9YUlhVQhBZroI8DjDLjkftXl7xseTZqF4OUWJv1gM-_9Z4AjJXbbXGlfQoYaK73g2loywO874XRlcqeh9Sfh2WVq8pAfIbKi0XFHBgJIuwjj9HTFZcrg5hUNmNPwLPZX', // physics
  ];

  // Select cover image or fallback
  const imageUrl =
    course.thumbnailUrl ||
    fallbackImages[Math.abs(course.title.charCodeAt(0) + course.title.charCodeAt(1)) % 3];

  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
      {/* Course Thumbnail & Status Badge */}
      <div className="relative h-48 w-full bg-surface-container overflow-hidden">
        <Image
          alt={course.title}
          fill
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
          src={imageUrl}
        />

        {/* Status Badge */}
        {isCompleted ? (
          <div className="absolute top-4 right-4 bg-secondary text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm font-semibold">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
            مكتمل
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm font-semibold">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
            قيد التقدم
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Category Tag & Title */}
        <div>
          <span className="inline-block bg-surface-container-high text-on-surface-variant text-[11px] px-2.5 py-1 rounded font-bold mb-2.5">
            {course.category || 'مادة تعليمية'}
          </span>
          <h3 className="font-bold text-lg text-on-surface leading-tight line-clamp-2 min-h-[3.25rem]">
            {course.title}
          </h3>
          <p className="text-on-surface-variant text-xs flex items-center gap-1.5 mt-1 font-medium">
            <UserRound size={14} className="text-gray-400" />
            <span>{course.teacher.name}</span>
          </p>
        </div>

        {/* Metrics Row (XP and Last Lesson Accessed) */}
        <div className="flex items-center justify-between bg-surface rounded-lg p-2.5 border border-outline-variant border-opacity-50 text-xs">
          {/* XP Count */}
          <div className="flex items-center gap-1 text-tertiary font-bold">
            <Award size={16} className="text-primary-container" />
            <span className="font-sans">{xpAwarded} XP</span>
          </div>

          {/* Last entry */}
          <div className="flex items-center gap-1 text-on-surface-variant font-medium">
            <History size={14} className="text-gray-400" />
            <span>{lastLesson ? `آخر دخول: ${lastLesson.title}` : 'آخر دخول: المقدمة'}</span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div>
          <div className="flex justify-between items-end mb-1.5 text-xs font-semibold">
            <span className="text-on-surface-variant">نسبة الإنجاز</span>
            <span
              className={`font-sans font-bold ${isCompleted ? 'text-secondary' : 'text-primary'}`}
            >
              {progressPct}%
            </span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-secondary' : 'bg-primary'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p
            className={`text-[11px] mt-2 font-bold ${isCompleted ? 'text-secondary' : 'text-primary'}`}
          >
            {encouragementText}
          </p>
        </div>

        {/* Bottom CTA Button */}
        {isCompleted ? (
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="mt-auto w-full bg-surface text-primary border border-outline-variant hover:bg-surface-container-high active:scale-[0.98] transition-all py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer no-underline hover:no-underline"
          >
            <span>مراجعة المحتوى</span>
            <RotateCcw size={16} />
          </Link>
        ) : (
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="mt-auto w-full bg-primary text-white hover:bg-primary-hover active:scale-[0.98] transition-all py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer no-underline hover:no-underline"
          >
            <span className="text-white">أكمل الكورس</span>
            <ArrowRight size={16} className="transform rotate-180 text-white" />
          </Link>
        )}
      </div>
    </article>
  );
}
