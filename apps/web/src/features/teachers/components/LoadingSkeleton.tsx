interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div
      className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="جارٍ تحميل قائمة المعلمين"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-lowest p-6"
        >
          <div className="mb-4 h-24 w-24 rounded-full bg-surface-container-high" />
          <div className="mb-2 h-5 w-32 rounded bg-surface-container-high" />
          <div className="mb-3 h-4 w-40 rounded bg-surface-container-high" />
          <div className="mb-6 h-12 w-full rounded-lg bg-surface-container-high" />
          <div className="h-9 w-full rounded-lg bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}
