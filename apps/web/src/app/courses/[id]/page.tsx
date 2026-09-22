import type { Metadata } from 'next';

import CourseDetailClient from '@/features/courseDetails/CourseDetailClient';

interface PageProps {
  params: { id: string };
}

/**
 * generateMetadata runs on the server and sets the <title> / description
 * from the live API response before the page is sent to the browser.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`,
      { next: { revalidate: 60 } }, // ISR: re-fetch at most every 60 s
    );

    if (!res.ok) throw new Error('not found');

    const course = await res.json();

    return {
      title: `${course.title} | سُلَّم`,
      description: course.description ?? `دورة ${course.title} على منصة سُلَّم التعليمية`,
    };
  } catch {
    return {
      title: 'تفاصيل الدورة | سُلَّم',
      description: 'استعرض تفاصيل الدورة التعليمية على منصة سُلَّم',
    };
  }
}

/**
 * Page is a thin server component.
 * All data-fetching and interactivity live inside CourseDetailClient ('use client').
 */
export default function CourseDetailPage({ params }: PageProps) {
  return (
    <main
      className="max-w-7xl mx-auto px-4 md:px-6 py-12"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      dir="rtl"
    >
      <CourseDetailClient id={params.id} />
    </main>
  );
}
