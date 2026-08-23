import type { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { CoursesPageClient } from '@/features/courses/components/CoursesPageClient';
import { courseKeys } from '@/features/courses/hooks/useCourses';
import { courseService } from '@/features/courses/services/course.service';

const INITIAL_PARAMS = { page: 1, limit: 9 } as const;

export const metadata: Metadata = {
  title: 'الدورات | سُلَّم',
  description: 'استعرض جميع الدورات التعليمية المتاحة على منصة سُلَّم',
  alternates: { canonical: '/courses' },
  openGraph: {
    title: 'الدورات | سُلَّم',
    description: 'استعرض جميع الدورات التعليمية المتاحة على منصة سُلَّم',
    url: '/courses',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'سُلَّم التعليمية',
  },
};

/**
 * CoursesPage — server component.
 *
 * Prefetches the first page of the catalog on the server and streams it to
 * the client through TanStack Query's HydrationBoundary so the course grid
 * is fully rendered in the initial server HTML (SEO + no client waterfall).
 */
export default async function CoursesPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // match useCourses staleTime
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: courseKeys.list(INITIAL_PARAMS),
    queryFn: () => courseService.getCourses(INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursesPageClient />
    </HydrationBoundary>
  );
}
