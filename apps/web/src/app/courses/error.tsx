'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoursesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[CoursesError]', error);
  }, [error]);

  return (
    <main
      className="grow flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4"
      dir="rtl"
    >
      <span className="text-6xl select-none">📡</span>

      <div className="flex flex-col gap-2">
        <h1 className="text-text text-xl font-bold">تعذّر تحميل الدورات</h1>
        <p className="text-text-muted text-sm max-w-sm mx-auto">
          {error.message ?? 'حدث خطأ أثناء الاتصال بالخادم. تحقق من اتصالك وحاول مجدداً.'}
        </p>
      </div>

      <button
        onClick={reset}
        className="px-6 py-2.5 bg-primary text-white rounded-radius-sm text-sm font-semibold hover:bg-primary-hover transition-colors"
      >
        حاول مجدداً
      </button>
    </main>
  );
}