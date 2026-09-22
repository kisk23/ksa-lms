import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCourse } from '@/features/courses/hooks/useCourse';
import { dashboardService } from '../services/dashboard.service';
import { dashboardKeys } from './useDashboard';

export const courseDashboardKeys = {
  progress: (courseId: string) => ['dashboard', 'courseProgress', courseId] as const,
  lessons: (courseId: string) => ['dashboard', 'lessonStatuses', courseId] as const,
};

export function useCourseDashboard(courseId: string) {
  const queryClient = useQueryClient();

  // 1. Fetch detailed course structure
  const courseQuery = useCourse(courseId);

  // 2. Fetch specific course progress summary
  const progressQuery = useQuery({
    queryKey: courseDashboardKeys.progress(courseId),
    queryFn: () => dashboardService.getCourseProgress(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 5,
  });

  // 3. Fetch lesson statuses
  const lessonsQuery = useQuery({
    queryKey: courseDashboardKeys.lessons(courseId),
    queryFn: () => dashboardService.getLessonStatuses(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 5,
  });

  // 4. Mutation to mark a lesson completed
  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: string) => dashboardService.completeLesson(lessonId),
    onSuccess: () => {
      // Invalidate specific course progress and lesson statuses
      queryClient.invalidateQueries({ queryKey: courseDashboardKeys.progress(courseId) });
      queryClient.invalidateQueries({ queryKey: courseDashboardKeys.lessons(courseId) });
      // Invalidate general dashboard list keys to keep total progress aligned
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });

  const isLoading = courseQuery.isLoading || progressQuery.isLoading || lessonsQuery.isLoading;
  const isError = courseQuery.isError || progressQuery.isError || lessonsQuery.isError;
  const error = courseQuery.error || progressQuery.error || lessonsQuery.error;

  return {
    course: courseQuery.data,
    progress: progressQuery.data,
    lessonStatuses: lessonsQuery.data ?? [],
    isLoading,
    isError,
    error,
    completeLesson: completeLessonMutation.mutate,
    isCompleting: completeLessonMutation.isPending,
  };
}
