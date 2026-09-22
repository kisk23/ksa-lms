import { Suspense } from 'react';
import type { Metadata } from 'next';
import { QuizResultClient } from '@/features/dashboard';

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'نتيجة الاختبار | سُلَّم',
  description: 'راجع نتيجتك وملخص أدائك في الاختبار.',
};

export default function QuizResultPage({ params }: PageProps) {
  // Wrap in Suspense because QuizResultClient uses useSearchParams
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
          جارٍ تحميل النتيجة...
        </div>
      }
    >
      <QuizResultClient />
    </Suspense>
  );
}
