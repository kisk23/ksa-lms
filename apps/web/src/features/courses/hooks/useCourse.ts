import { useQuery } from '@tanstack/react-query';

import { courseService } from '../services/course.service';
import { courseKeys } from './useCourses';

/**
 * Full course detail including chapters + lessons.
 * Backed by GET /courses/:id → CoursesService.findOne().
 *
 * Query is disabled when id is empty/undefined so it's safe to call
 * unconditionally before the route param is available.
 */
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourse(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
