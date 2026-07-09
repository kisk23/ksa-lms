import type { Metadata } from 'next';

import { LessonPageClient } from '@/features/lessons';

interface PageProps {
  params: {
    id: string;
    lessonId: string;
  };
}

/**
 * generateMetadata — runs on the server before the page is sent.
 *
 * Fetches the course (which includes chapters + lessons) to derive the
 * lesson title for <title> and <description> without an extra endpoint.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`, {
      next: { revalidate: 60 },
    });
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
      title: lesson ? `${lesson.title} | ${course.title} | سُلَّم` : 'درس | سُلَّم',
      description: `تعلّم ${lesson?.title ?? ''} ضمن دورة ${course.title}`,
    };
  } catch {
    return {
      title: 'درس | سُلَّم',
      description: 'استعرض محتوى الدرس على منصة سُلَّم التعليمية',
    };
  }
}

/**
 * LessonPage — thin server component.
 *
 * Fetches the course shell (chapters + basic lesson list) on the server
 * so the sidebar and navigation are available immediately without a
 * client-side waterfall.
 *
 * The lesson detail itself (progress, assignment) is fetched client-side
 * inside LessonPageClient because it requires the student's auth token.
 */
export default async function LessonPage({ params }: PageProps) {
  const { id: courseId, lessonId } = params;

  // Server-side fetch — no auth token needed for public course metadata
  let chapters: any[] = [];
  let courseTitle = '';
  let teacherName = '';
  let chapterId = '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const response = await res.json();
      const course = response.data;
      chapters = course.chapters ?? [];
      courseTitle = course.title ?? '';
      teacherName = course.teacher?.name ?? '';

      // Find the chapterId for the current lessonId
      for (const ch of chapters) {
        const found = ch.lessons?.find((l: any) => l.id === lessonId);
        if (found) {
          chapterId = ch.id;
          break;
        }
      }
    }
  } catch (err) {
    console.error('Server-side course fetch failed:', err);
    // If the server fetch fails, LessonPageClient will still fetch lesson
    // detail client-side; the sidebar will be empty until hydration.
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 pt-[96px] pb-10">
      <LessonPageClient
        courseId={courseId}
        chapterId={chapterId}
        lessonId={lessonId}
        chapters={chapters}
        courseTitle={courseTitle}
        teacherName={teacherName}
      />
    </main>
  );
}
