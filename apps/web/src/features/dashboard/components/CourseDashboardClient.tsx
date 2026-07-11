'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  Play,
  Clock,
  FileText,
  Lock,
  CheckCircle,
  Award,
  Trophy,
  BarChart2,
  FileBadge,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { useCourseDashboard } from '../hooks/useCourseDashboard';

interface CourseDashboardClientProps {
  courseId: string;
}

export function CourseDashboardClient({ courseId }: CourseDashboardClientProps) {
  const {
    course,
    progress,
    lessonStatuses,
    isLoading,
    isError,
    error,
    completeLesson,
    isCompleting,
  } = useCourseDashboard(courseId);

  // Accordion open/close state for units (chapters)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Flattened sorted lessons to compute sequential locks
  const { sortedLessons, firstUncompletedIndex, activeLesson } = useMemo(() => {
    if (!course || !course.chapters) {
      return { sortedLessons: [], firstUncompletedIndex: -1, activeLesson: null };
    }

    const sortedChapters = [...course.chapters].sort((a, b) => a.orderIndex - b.orderIndex);
    const lessonsList: any[] = [];

    sortedChapters.forEach((chapter) => {
      const chapterLessons = [...chapter.lessons]
        .filter((l) => !l.isArchived)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      chapterLessons.forEach((lesson) => {
        lessonsList.push({
          ...lesson,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
        });
      });
    });

    // Match each lesson with its completion status from API
    const lessonsWithStatus = lessonsList.map((lesson) => {
      const statusObj = lessonStatuses.find((s: any) => s.lessonId === lesson.id);
      const isCompleted = statusObj?.progress?.completed ?? false;
      return {
        ...lesson,
        isCompleted,
        watchedPct: statusObj?.progress?.watchedPct ?? 0,
      };
    });

    const uncompletedIdx = lessonsWithStatus.findIndex((l) => !l.isCompleted);
    const actLesson = uncompletedIdx !== -1 ? lessonsWithStatus[uncompletedIdx] : null;

    return {
      sortedLessons: lessonsWithStatus,
      firstUncompletedIndex: uncompletedIdx,
      activeLesson: actLesson,
    };
  }, [course, lessonStatuses]);

  // Expand active lesson's chapter on load
  useEffect(() => {
    if (activeLesson?.chapterId) {
      setExpandedChapters((prev) => ({
        ...prev,
        [activeLesson.chapterId]: true,
      }));
    }
  }, [activeLesson?.chapterId]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-on-surface-variant text-sm font-semibold">جاري تحميل الكورس...</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <AlertCircle className="text-red-500 w-12 h-12" />
        <h3 className="text-lg font-bold text-on-surface">فشل تحميل كورس الطالب</h3>
        <p className="text-on-surface-variant text-xs max-w-sm">
          {error instanceof Error
            ? error.message
            : 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.'}
        </p>
      </div>
    );
  }

  // Calculate circular progress metrics
  const progressPct = progress?.progressPct ?? 0;
  const completedLessons = progress?.completedLessons ?? 0;
  const isCompleted = progressPct >= 100;

  const radius = 45;
  const circumference = 2 * Math.PI * radius; // 282.7
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  // Handler for completing active lesson
  const handleCompleteLesson = (lessonId: string) => {
    if (isCompleting) return;
    completeLesson(lessonId);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
        <Link href="/dashboard" className="hover:text-primary transition-colors no-underline">
          دوراتي
        </Link>
        <ChevronLeft size={14} className="text-gray-400" />
        <span className="text-on-surface font-bold line-clamp-1">{course.title}</span>
      </div>

      {/* Hero Header Section */}
      <div className="bg-primary rounded-xl overflow-hidden relative shadow-md text-right">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-12 w-64 h-64 bg-surface-tint rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/10 font-bold backdrop-blur-sm">
                {course.category || 'مادة تعليمية'}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/10 font-bold backdrop-blur-sm">
                مستوى متقدم
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {course.title}
            </h2>
            <p className="text-white/80 text-sm max-w-2xl leading-relaxed">
              {course.description ||
                'تابع دروسك وتفاعل مع الاختبارات التقييمية للحصول على شهادة معتمدة.'}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              {activeLesson ? (
                <Link
                  href={`/courses/${course.id}/lessons/${activeLesson.id}`}
                  className="w-full sm:w-auto bg-secondary hover:bg-secondary-fixed text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 no-underline hover:no-underline"
                >
                  <span>ابدأ من آخر درس</span>
                  <Play size={16} fill="currentColor" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto bg-gray-400 text-white font-bold px-8 py-3 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>الكورس مكتمل</span>
                  <CheckCircle size={16} />
                </button>
              )}
              <span className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                <Clock size={16} />
                آخر تحديث: {new Date(course.updatedAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>

          {/* Circular Progress Indicator */}
          <div className="w-44 h-44 relative flex-shrink-0 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm border border-white/20 p-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="transparent"
                r="45"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                fill="transparent"
                r="45"
                stroke="#1FC58E"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="8"
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-3xl font-sans font-bold">{progressPct}%</span>
              <span className="text-xs opacity-80 mt-1">مكتمل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout (Next Lesson + Achievements) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Lesson Box */}
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-surface-container-high rounded-lg overflow-hidden relative group">
            {activeLesson ? (
              <>
                <img
                  alt="صورة توضيحية للدرس"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF3PJ27TUL8391m7F5wRTL3h2Pk7omO8vXNT6loVhkBwzGBnmAIAesDsO7nmhIjL0U7mqHpBDB7dk-xyfqJI4B_pXaHPHjF0jdpUQVCHR1kPFQ-E4Cj0EhimHUmmjSAIbYvHZqysuh5993aocOxMQ3sCWqRNKXjFSM-gGAmljQU78JDbIq0neKHBnPGcMxb3_UsmD6rkQjTdEdbrDiw7kn50oC8D44qAE-Dql5qVWyL1ZuWlVH7TFp_SG45bjHM7Wxc-NyD3NobXqD"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Link
                    href={`/courses/${course.id}/lessons/${activeLesson.id}`}
                    className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform active:scale-95 no-underline"
                  >
                    <Play size={20} fill="currentColor" className="mr-0.5" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-secondary">
                <CheckCircle size={36} />
              </div>
            )}
          </div>

          <div className="flex-grow text-right w-full flex flex-col justify-between self-stretch py-1">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-secondary font-bold text-xs bg-secondary/15 px-2.5 py-1 rounded">
                  الدرس التالي
                </span>
                <span className="text-on-surface-variant text-xs font-semibold">
                  {activeLesson?.chapterTitle || 'لا يوجد'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-2">
                {activeLesson?.title || 'أنهيت جميع دروس هذا المقرر!'}
              </h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-4 line-clamp-2">
                {activeLesson
                  ? 'انقر لتشغيل الدرس واستكشاف الملخصات وحل المهمة المقترنة بالدرس الحالي.'
                  : 'لقد أتممت كافة الوحدات بنجاح. يمكنك مراجعة المحتوى في أي وقت.'}
              </p>
            </div>
            {activeLesson && (
              <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  <span>25 دقيقة</span>
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={14} className="text-gray-400" />
                  <span>3 مصادر</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats / Achievements Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-on-surface mb-4">إنجازاتك</h3>
            <div className="space-y-4">
              {/* Badge 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <Trophy size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-xs text-on-surface">طالب متميز</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    أكملت {completedLessons} دروس في هذا المقرر
                  </p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Award size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-xs text-on-surface">الاستمرار والمواظبة</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    قمت بزيارة لوحة التحكم بانتظام
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-surface-container-low rounded-lg text-center border border-outline-variant/50">
            <p className="text-[11px] text-primary font-bold">
              {isCompleted ? 'رائع! أتممت الكورس بالكامل 🌟' : 'استمر! أنت تتقدم بشكل رائع 🚀'}
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum & Grades Column Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chapters Curriculum Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
            <h3 className="font-bold text-lg text-on-surface">محتوى المقرر</h3>
            <span className="text-on-surface-variant text-xs font-semibold">
              {(course.chapters || []).length} فصول • {sortedLessons.length} دروس
            </span>
          </div>

          {/* Chapters Accordion */}
          {(course.chapters || [])
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((chapter, chIdx) => {
              const isExpanded = !!expandedChapters[chapter.id];

              // Filter sorted lessons belonging to this chapter
              const chapterLessons = sortedLessons.filter((l) => l.chapterId === chapter.id);
              const chapterCompletedCount = chapterLessons.filter((l) => l.isCompleted).length;
              const isChapterCompleted =
                chapterLessons.length > 0 && chapterCompletedCount === chapterLessons.length;

              return (
                <div
                  key={chapter.id}
                  className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-300
                    ${
                      isExpanded
                        ? 'border-primary/30 ring-1 ring-primary/5 shadow-ambient'
                        : 'border-gray-200'
                    }
                  `}
                >
                  {/* Chapter Header Link */}
                  <div
                    onClick={() => toggleChapter(chapter.id)}
                    className={`p-4 flex justify-between items-center cursor-pointer transition-colors
                      ${isExpanded ? 'bg-primary/5' : 'bg-surface-container-low hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {isChapterCompleted ? (
                        <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                          <CheckCircle size={18} fill="currentColor" className="text-secondary" />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center shadow-sm
                          ${isExpanded ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
                        `}
                        >
                          <Play size={14} fill={isExpanded ? 'currentColor' : 'none'} />
                        </div>
                      )}
                      <div>
                        <h4
                          className={`text-sm font-bold
                          ${isExpanded ? 'text-primary' : 'text-on-surface'}
                        `}
                        >
                          الوحدة {chIdx + 1}: {chapter.title}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                          {chapterLessons.length} دروس •{' '}
                          {isChapterCompleted
                            ? 'مكتملة بالكامل'
                            : `أُنجز ${chapterCompletedCount} منها`}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform duration-300
                        ${isExpanded ? 'transform rotate-180 text-primary' : ''}
                      `}
                    />
                  </div>

                  {/* Chapter Lesson List */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100 border-t border-gray-100 bg-white">
                      {chapterLessons.map((lesson, index) => {
                        // Sequential locked logic
                        const globalIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
                        const isLessonCompleted = lesson.isCompleted;
                        const isLessonActive = globalIndex === firstUncompletedIndex;
                        const isLessonLocked = globalIndex > firstUncompletedIndex;

                        return (
                          <div
                            key={lesson.id}
                            className={`p-4 pl-6 flex items-center justify-between transition-colors
                              ${isLessonActive ? 'bg-primary/5 border-r-4 border-primary' : 'hover:bg-gray-50/60'}
                              ${isLessonLocked ? 'opacity-50' : ''}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              {/* Icon indicators */}
                              {isLessonCompleted ? (
                                <CheckCircle
                                  size={18}
                                  className="text-secondary"
                                  fill="currentColor"
                                />
                              ) : isLessonActive ? (
                                <Play size={18} className="text-primary animate-pulse" />
                              ) : (
                                <Lock size={16} className="text-gray-400" />
                              )}

                              <div className="text-right">
                                <p
                                  className={`text-xs font-semibold
                                  ${isLessonActive ? 'text-primary font-bold' : 'text-on-surface'}
                                `}
                                >
                                  {chIdx + 1}.{index + 1} {lesson.title}
                                </p>
                                {isLessonActive && (
                                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                                    فيديو + اختبار تدريبي
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions or metadata */}
                            {isLessonActive ? (
                              <button
                                onClick={() => handleCompleteLesson(lesson.id)}
                                disabled={isCompleting}
                                className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold px-4 py-1.5 rounded active:scale-95 transition-all shadow-sm flex items-center gap-1 disabled:opacity-75"
                              >
                                {isCompleting ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Check size={12} />
                                )}
                                <span>إكمال</span>
                              </button>
                            ) : isLessonCompleted ? (
                              <span className="text-[10px] text-secondary font-bold font-sans">
                                مكتمل
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium font-sans">
                                مغلق
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Right Grades & Certificate Panel Column (1/3) */}
        <div className="space-y-6">
          {/* Grades Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <BarChart2 className="text-primary w-5 h-5" />
              <h3 className="font-bold text-base text-on-surface">درجات التقييم</h3>
            </div>
            <div className="space-y-5">
              {/* Grade item 1 */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-on-surface">اختبار الوحدة الأولى</span>
                  <span className="font-sans font-bold text-secondary">100 / 100</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full rounded-full"></div>
                </div>
              </div>

              {/* Grade item 2 */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-on-surface">المشاركة والتفاعل</span>
                  <span className="font-sans font-bold text-primary">85 / 100</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full"></div>
                </div>
              </div>

              {/* Grade item 3 */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs text-on-surface-variant">
                  <span className="font-semibold">اختبار الوحدة الثانية</span>
                  <span className="font-sans text-[11px] font-medium">- / 100</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 w-0 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Status Card */}
          <div className="bg-gradient-to-br from-surface-container-high to-surface rounded-xl shadow-sm border border-primary/20 p-6 relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 text-primary/10 select-none">
              <FileBadge className="w-28 h-28" />
            </div>
            <div className="relative z-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-primary">
                <FileBadge
                  size={28}
                  className={progressPct >= 100 ? 'text-secondary' : 'text-gray-400'}
                />
              </div>
              <h3 className="font-bold text-base text-on-surface">شهادة الإتمام</h3>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                أكمل جميع الوحدات والاختبارات بنسبة نجاح 70% على الأقل للحصول على الشهادة المعتمدة.
              </p>
              {progressPct >= 100 ? (
                <button className="mt-2 w-full bg-secondary hover:bg-secondary-fixed text-white px-4 py-2.5 rounded text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                  تحميل الشهادة المعتمدة
                </button>
              ) : (
                <button
                  disabled
                  className="mt-2 w-full bg-gray-200 border border-gray-300 text-gray-400 px-4 py-2.5 rounded text-xs font-semibold cursor-not-allowed opacity-75"
                >
                  غير متاحة بعد
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
