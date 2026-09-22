import type { Metadata } from 'next';

import { AssignmentPageClient } from '@/features/assignment';

interface PageProps {
  params: {
    id: string;
    lessonId: string;
    assignmentId: string;
  };
}

/**
 * generateMetadata — runs on the server before the page is sent.
 *
 * Fetches the course metadata to derive the lesson title for the SEO <title> and <description>.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/courses/${params.id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('not found');

    const response = await res.json();
    const course = response.data;
    let lesson: any = null;

    // Search the chapters structure for the current lessonId to find the lesson and title
    for (const chapter of course.chapters ?? []) {
      const found = chapter.lessons?.find((l: any) => l.id === params.lessonId);
      if (found) {
        lesson = found;
        break;
      }
    }

    return {
      title: lesson ? `واجب: ${lesson.title} | ${course.title} | سُلَّم` : 'واجب الدرس | سُلَّم',
      description: `حل واجب درس ${lesson?.title ?? ''} في دورة ${course.title}`,
    };
  } catch {
    return {
      title: 'واجب الدرس | سُلَّم',
      description: 'حل واجب الدرس على منصة سُلَّم التعليمية',
    };
  }
}

/**
 * AssignmentPage — thin server component.
 *
 * Delegates stateful quiz actions, API client calls, and TanStack query mutations
 * to the client component AssignmentPageClient.
 */
export default async function AssignmentPage({ params }: PageProps) {
  const { id: courseId, lessonId, assignmentId } = params;

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 pt-[96px] pb-10">
      <AssignmentPageClient
        courseId={courseId}
        lessonId={lessonId}
        assignmentId={assignmentId}
      />
    </main>
  );
}