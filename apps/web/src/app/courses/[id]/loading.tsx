/**
 * Next.js shows this file automatically while the page segment is streaming.
 * It mirrors the exact grid layout of CourseDetailPage so there's no layout shift.
 */
export default function CourseDetailLoading() {
  return (
    <main
      className="max-w-7xl mx-auto px-4 md:px-6 py-12"
      dir="rtl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">

      

        {/* ── Main content skeleton ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Hero video */}
          <div className="aspect-video w-full rounded-xl bg-gray-200" />

          {/* Course info block */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-9 w-3/4 bg-gray-200 rounded" />
            <div className="h-5 w-full bg-gray-200 rounded" />
            <div className="h-5 w-5/6 bg-gray-200 rounded" />
            {/* Meta row */}
            <div className="flex gap-6 mt-2">
              <div className="h-8 w-32 bg-gray-200 rounded-full" />
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
              <div className="h-8 w-28 bg-gray-200 rounded-full" />
            </div>
            <div className="h-px bg-gray-300 mt-1" />
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-full  bg-gray-200 rounded" />
            <div className="h-4 w-4/5  bg-gray-200 rounded" />
          </div>

          {/* What you'll learn */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-200">
            <div className="h-6 w-36 bg-gray-200 rounded mb-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0 mt-0.5" />
                  <div className="h-4 flex-1 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between mb-2">
              <div className="h-7 w-40 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-lg border-2 border-border bg-gray-200"
              />
            ))}
          </div>

          {/* Instructor */}
          <div className="p-6 rounded-xl border-2 border-border bg-surface flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-3 flex-1">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-52 bg-gray-200 rounded" />
              <div className="h-4 w-full  bg-gray-200 rounded" />
              <div className="h-4 w-4/5  bg-gray-200 rounded" />
            </div>
          </div>

        </div>
          {/* ── Pricing card skeleton ── */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border-2 border-gray-200 p-6 flex flex-col gap-5 bg-gray-200">
            {/* Price */}
            <div className="h-10 w-28 mx-auto bg-gray-200 rounded-lg" />
            {/* CTA button */}
            <div className="h-12 w-full bg-gray-200 rounded-lg" />
            {/* Feature rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
                <div className="h-3 flex-1 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}