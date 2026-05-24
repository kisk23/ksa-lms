'use client';

import CourseDetailLoading from '@/app/courses/[id]/loading';
import CourseHero         from '@/features/courseDetails/CourseHero';
import CourseInfo         from '@/features/courseDetails/CourseInfo';
import Curriculum         from '@/features/courseDetails/Curriculum';
import InstructorProfile  from '@/features/courseDetails/InstructorProfile';
import PricingCard        from '@/features/courseDetails/PricingCard';
import WhatYouLearn       from '@/features/courseDetails/WhatYouLearn';
import { useCourse }      from '@/features/courses/hooks/useCourse';

interface CourseDetailClientProps {
  id: string;
}

// ─── Error state ──────────────────────────────────────────────────────────────

function DetailError({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4"
      dir="rtl"
    >
      <span className="text-6xl">⚠️</span>
      <h2 className="text-text text-xl font-bold">تعذّر تحميل بيانات الدورة</h2>
      <p className="text-text-muted text-sm max-w-md">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2.5 bg-primary  text-white rounded-radius-sm text-sm font-semibold hover:bg-primary-hover transition-colors"
      >
        حاول مجدداً
      </button>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export default function CourseDetailClient({ id }: CourseDetailClientProps) {
  const { data: { data: course } = {}, isLoading, isError, error } = useCourse(id);

  if (isLoading) return <CourseDetailLoading />;

  if (isError || !course) {
    return (
      <DetailError
        message={
          error instanceof Error
            ? error.message
            : 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.'
        }
      />
    );
  }
  console.log(course);

  // Pick the YouTube ID of the first non-archived lesson across all chapters
  const firstLesson = course.chapters
    .slice()
    .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
    .flatMap((ch: any) =>
      ch.lessons
        .filter((l: any) => !l.isArchived)
        .sort((a: any, b: any) => a.orderIndex - b.orderIndex),
    )[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      

      {/* ── RIGHT — Course content ── */}
      <div className="lg:col-span-8 flex flex-col gap-10">
        <CourseHero
          youtubeVideoId={firstLesson?.youtubeVideoId}
          title={course.title}
        />
        <CourseInfo course={course} />
        <WhatYouLearn chapters={course.chapters} />
        <Curriculum chapters={course.chapters} />
        <InstructorProfile
          teacher={course.teacher}
          courseCount={10}
        />
      </div>
      {/* ── LEFT — Sticky pricing card ── */}
      <div className="lg:col-span-4 order-first lg:order-0">
        <PricingCard course={course} />
      </div>
    </div>
  );
}
