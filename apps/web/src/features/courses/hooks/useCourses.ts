import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { courseService } from '../services/course.service';
import type { CoursesQueryParams } from '../types';

/** Centralised query-key factory — import wherever you need to invalidate. */
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params: CoursesQueryParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

/**
 * Paginated course list with optional search / status filter.
 * Backed by GET /courses → CoursesService.findAll().
 *
 * The AbortSignal from TanStack Query is forwarded to axios so stale
 * requests (rapid search typing / filter switching) are cancelled instead
 * of racing newer ones.
 */
export function useCourses(params: CoursesQueryParams = {}) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: ({ signal }) => courseService.getCourses(params, { signal }),
    staleTime: 1000 * 60 * 5, // 5 min
    placeholderData: keepPreviousData, // keep previous data while fetching next page
  });
}
