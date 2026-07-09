/**
 * Shown by Next.js while the lesson page segment streams.
 * Mirrors the exact two-column layout so there's no shift on hydration.
 */
export default function LessonLoading() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 pt-[96px] pb-10" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-6 animate-pulse">
        {/* Sidebar skeleton */}
        <aside className="w-full lg:w-80 xl:w-[360px] shrink-0 order-2 lg:order-1">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="h-12 bg-gray-200 border-b border-gray-200" />
            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0" />
                <div className="h-3 flex-1 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main content skeleton */}
        <section className="flex-1 flex flex-col gap-5 order-1 lg:order-2">
          {/* Video */}
          <div className="aspect-video w-full rounded-xl bg-gray-200" />

          {/* Action bar */}
          <div className="h-14 rounded-xl bg-gray-100" />

          {/* Title */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-24 bg-gray-200 rounded-full" />
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
          </div>

          {/* Tabs */}
          <div className="h-11 rounded-t-xl bg-gray-100 border border-gray-200" />
          <div className="h-48 rounded-b-xl bg-gray-50 border border-t-0 border-gray-200" />
        </section>
      </div>
    </main>
  );
}
