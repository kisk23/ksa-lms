'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LessonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[LessonError]', error);
  }, [error]);

  return (
    <main
      className="max-w-[1440px] mx-auto px-4 md:px-6 pt-[96px] pb-10 flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center"
      dir="rtl"
    >
      <span className="text-6xl">⚠️</span>
      <h1 className="text-2xl font-bold text-gray-800">تعذّر تحميل الدرس</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        {error.message ?? 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.'}
      </p>
      {error.digest && (
        <p className="text-xs text-gray-400 font-mono">رمز الخطأ: {error.digest}</p>
      )}
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          حاول مجدداً
        </button>
        <Link
          href="/courses"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          العودة للدورات
        </Link>
      </div>
    </main>
  );
}
