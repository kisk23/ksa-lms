'use client';

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

// ─── Skeleton shown while data loads ─────────────────────────────────────────

// function DetailSkeleton() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse" dir="rtl">
//       {/* Pricing column */}
//       <div className="lg:col-span-4">
//         <div className="rounded-xl border-2 border-border p-6 flex flex-col gap-5 bg-surface">
//           <div className="h-10 w-32 mx-auto bg-surface-hover rounded-lg" />
//           <div className="h-12 w-full bg-surface-hover rounded-lg" />
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex gap-3 items-center">
//               <div className="w-5 h-5 rounded bg-surface-hover shrink-0" />
//               <div className="h-3 w-full bg-surface-hover rounded" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main column */}
//       <div className="lg:col-span-8 flex flex-col gap-8">
//         {/* Hero */}
//         <div className="aspect-video w-full rounded-xl bg-surface-hover" />
//         {/* Title block */}
//         <div className="flex flex-col gap-3">
//           <div className="h-4 w-24 bg-surface-hover rounded-full" />
//           <div className="h-8 w-3/4 bg-surface-hover rounded" />
//           <div className="h-5 w-full bg-surface-hover rounded" />
//           <div className="h-5 w-2/3 bg-surface-hover rounded" />
//         </div>
//         {/* What you'll learn */}
//         <div className="p-6 rounded-xl border border-border bg-surface grid grid-cols-2 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-4 bg-surface-hover rounded" />
//           ))}
//         </div>
//         {/* Curriculum */}
//         <div className="flex flex-col gap-3">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="h-14 rounded-lg bg-surface-hover" />
//           ))}
//         </div>
//         {/* Instructor */}
//         <div className="p-6 rounded-xl border-2 border-border bg-surface flex gap-6">
//           <div className="w-24 h-24 rounded-full bg-surface-hover shrink-0" />
//           <div className="flex flex-col gap-3 flex-1">
//             <div className="h-5 w-40 bg-surface-hover rounded" />
//             <div className="h-4 w-56 bg-surface-hover rounded" />
//             <div className="h-4 w-full bg-surface-hover rounded" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  // if (isLoading) return <DetailSkeleton />;

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
      <div className="lg:col-span-8 flex flex-col gap-8">
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
