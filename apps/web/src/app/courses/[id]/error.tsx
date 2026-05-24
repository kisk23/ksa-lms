'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js error boundary for /courses/[id].
 * Shown when an unhandled error is thrown inside the segment —
 * e.g. a failed fetch in generateMetadata or a server component error.
 * Client-side errors inside CourseDetailClient are handled inline there.
 */
export default function CourseDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error-tracking service here (Sentry, etc.)
    console.error('[CourseDetailError]', error);
  }, [error]);

  return (
    <main
      className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
      dir="rtl"
    >
      <span className="text-6xl select-none">⚠️</span>

      <div className="flex flex-col gap-2">
        <h1 className="text-text text-2xl font-bold">تعذّر تحميل الدورة</h1>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          {error.message ?? 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.'}
        </p>
        {error.digest && (
          <p className="text-text-muted text-xs mt-1 font-mono">
            رمز الخطأ: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-primary text-white rounded-radius-sm text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          حاول مجدداً
        </button>
        <a
          href="/courses"
          className="px-6 py-2.5 border border-border text-text rounded-radius-sm text-sm font-semibold hover:bg-surface-hover transition-colors"
        >
          العودة للدورات
        </a>
      </div>
    </main>
  );
}