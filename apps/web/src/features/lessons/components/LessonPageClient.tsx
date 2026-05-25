'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useMemo } from 'react';

import { useLesson }        from '../hooks/useLesson';
import { useLessonStatuses, useAssignments, useLessonFiles, useCourseProgress }
  from '../hooks/useQueries';
import { VideoPlayer }       from './VideoPlayer';
import { LessonHeader }      from './LessonHeader';
import { CurriculumSidebar } from './CurriculumSidebar';
import { MarkCompleteButton } from './MarkCompleteButton';
import { LessonTabs }        from './LessonTabs';
import type { Chapter, FlatLesson } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

function LessonSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-pulse" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="bg-gray-100 rounded-xl h-[500px]" />
      </aside>
      {/* Main */}
      <section className="flex-1 flex flex-col gap-5">
        <div className="aspect-video w-full rounded-xl bg-gray-200" />
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
        <div className="h-48 w-full bg-gray-100 rounded-xl" />
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Error
// ─────────────────────────────────────────────────────────────────────────────

function LessonError({ message, courseId }: { message: string; courseId: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center" dir="rtl">
      <span className="text-5xl">⚠️</span>
      <h2 className="text-xl font-bold text-gray-800">تعذّر تحميل الدرس</h2>
      <p className="text-sm text-gray-500 max-w-sm">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          حاول مجدداً
        </button>
        <Link
          href={`/courses/${courseId}`}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          العودة للدورة
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LessonPageClient — props
// ─────────────────────────────────────────────────────────────────────────────

interface LessonPageClientProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  /** Pass chapters from the course-level fetch to avoid an extra round-trip */
  chapters: Chapter[];
  courseTitle: string;
  teacherName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function LessonPageClient({
  courseId,
  chapterId,
  lessonId,
  chapters,
  courseTitle,
  teacherName,
}: LessonPageClientProps) {

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: lesson,      isLoading: lessonLoading, error: lessonError }
    = useLesson(courseId, chapterId, lessonId);

    const { data: rawStatuses } = useLessonStatuses(courseId);

    const statuses = Array.isArray(rawStatuses)
      ? rawStatuses
      : [];

  const { data: progress }
    = useCourseProgress(courseId);

  const { data: assignments = [], isLoading: assignmentsLoading, error: assignmentsError }
    = useAssignments(lessonId);

  const { data: files = [], isLoading: filesLoading, error: filesError }
    = useLessonFiles(lessonId);

  // ── Build a flat sorted lesson list for prev/next navigation ───────────────
  const flatLessons = useMemo<FlatLesson[]>(() => {
    const completedSet = new Set(
      statuses.filter((s) => s.progress?.isCompleted).map((s) => s.lessonId),
    );
    return [...chapters]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .flatMap((ch) =>
        [...ch.lessons]
          .filter((l) => !l.isArchived)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((l) => ({
            lessonId:           l.id,
            chapterId:          ch.id,
            courseId,
            title:              l.title,
            orderIndex:         l.orderIndex,
            chapterOrderIndex:  ch.orderIndex,
            isCompleted:        completedSet.has(l.id),
          })),
      );
  }, [chapters, statuses, courseId]);

  const currentIdx = flatLessons.findIndex((l) => l.lessonId === lessonId);
  const prevLesson = currentIdx > 0 ? flatLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < flatLessons.length - 1 ? flatLessons[currentIdx + 1] : null;

  // ── States ─────────────────────────────────────────────────────────────────
  if (lessonLoading) return <LessonSkeleton />;

  if (lessonError || !lesson) {
    return (
      <LessonError
        courseId={courseId}
        message={
          lessonError instanceof Error
            ? lessonError.message
            : 'حدث خطأ غير متوقع.'
        }
      />
    );
  }

  const isCompleted = lesson.progress?.isCompleted ?? false;
  const completedCount = progress?.completedLessons ?? 0;
  // Calculate total lessons from chapters data instead of progress to avoid 0/0
  const totalCount = chapters.reduce((sum, ch) => sum + (ch.lessons?.length ?? 0), 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start" dir="rtl">

      {/*
        ══ SIDEBAR — right column in RTL
           Desktop: sticky, 320px wide
           Mobile:  collapses below the main content (order-2)
      ══ */}
      <aside className="w-full lg:w-80 xl:w-[360px] md:sticky md:top-25 shrink-0 order-2 lg:order-1">
        <CurriculumSidebar
          courseId={courseId}
          chapters={chapters}
          activeLessonId={lessonId}
          statuses={statuses}
          completedCount={completedCount}
          totalCount={totalCount}
        />
      </aside>

      {/*
        ══ MAIN CONTENT — left column in RTL
      ══ */}
      <section className="flex-1 flex flex-col gap-5 w-full order-1 lg:order-2">

        {/* Video */}
        <VideoPlayer
          youtubeVideoId={lesson.youtubeVideoId}
          title={lesson.title}
        />

        {/* Action bar: prev / next / mark complete */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Previous */}
            {prevLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${prevLesson.lessonId}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
              >
                <ArrowRight size={18} />
                السابق
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-2 text-gray-300 text-sm font-medium cursor-not-allowed">
                <ArrowRight size={18} />
                السابق
              </span>
            )}

            <div className="w-px h-5 bg-gray-200" />

            {/* Next */}
            {nextLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${nextLesson.lessonId}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
              >
                التالي
                <ArrowLeft size={18} />
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-2 text-gray-300 text-sm font-medium cursor-not-allowed">
                التالي
                <ArrowLeft size={18} />
              </span>
            )}
          </div>

          {/* Mark complete */}
          <MarkCompleteButton
            courseId={courseId}
            chapterId={chapterId}
            lessonId={lessonId}
            isCompleted={isCompleted}
          />
        </div>

        {/* Lesson title + metadata */}
        <LessonHeader lesson={lesson} courseTitle={courseTitle} />

        {/* Tabs: overview / files / assignments / discussions */}
        <LessonTabs
          lesson={lesson}
          courseTitle={courseTitle}
          teacherName={teacherName}
          assignments={assignments}
          assignmentsLoading={assignmentsLoading}
          assignmentsError={assignmentsError as Error | null}
          files={files}
          filesLoading={filesLoading}
          filesError={filesError as Error | null}
        />

      </section>
    </div>
  );
}
