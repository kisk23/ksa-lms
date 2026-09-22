import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { dashboardService } from '../services/dashboard.service';
import type { StudentEnrollment, DashboardStats } from '../types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  enrollments: () => [...dashboardKeys.all, 'enrollments'] as const,
  progress: (studentId: string) => [...dashboardKeys.all, 'progress', studentId] as const,
};

export function useStudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const studentId = user?.id;

  // 1. Fetch enrollments history
  const enrollmentsQuery = useQuery({
    queryKey: dashboardKeys.enrollments(),
    queryFn: () => dashboardService.getMyEnrollments(),
    enabled: isAuthenticated && !!studentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. Fetch course progress list
  const progressQuery = useQuery({
    queryKey: dashboardKeys.progress(studentId || ''),
    queryFn: () => dashboardService.getMyCourseProgress(studentId || ''),
    enabled: isAuthenticated && !!studentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 3. Merge enrollments and progress, calculate statistics
  const dashboardData = useMemo(() => {
    const enrollments = enrollmentsQuery.data ?? [];
    const progressList = progressQuery.data ?? [];

    // Create a lookup map for progress by courseId
    const progressMap = new Map(progressList.map((p) => [p.courseId, p]));

    // Merge progress into enrollments
    const merged: StudentEnrollment[] = enrollments.map((enrollment) => {
      const progress = progressMap.get(enrollment.courseId) || null;
      return {
        ...enrollment,
        progress,
      };
    });

    // Calculate statistics
    let completedCount = 0;
    let inProgressCount = 0;
    let totalXp = 0;

    merged.forEach((item) => {
      const isCompleted = item.status === 'COMPLETED' || (item.progress?.progressPct ?? 0) >= 100;
      if (isCompleted) {
        completedCount++;
      } else if (item.status === 'ACTIVE') {
        inProgressCount++;
      }

      // Compute dynamic XP: 50 XP per completed lesson
      const completedLessons = item.progress?.completedLessons ?? 0;
      totalXp += completedLessons * 50;
    });

    const stats: DashboardStats = {
      enrolledCount: merged.length,
      completedCount,
      inProgressCount,
      totalXp,
    };

    return {
      enrollments: merged,
      stats,
    };
  }, [enrollmentsQuery.data, progressQuery.data]);

  const isLoading = enrollmentsQuery.isLoading || progressQuery.isLoading;
  const isError = enrollmentsQuery.isError || progressQuery.isError;
  const error = enrollmentsQuery.error || progressQuery.error;

  return {
    enrollments: dashboardData.enrollments,
    stats: dashboardData.stats,
    isLoading,
    isError,
    error,
    refetch: () => {
      enrollmentsQuery.refetch();
      progressQuery.refetch();
    },
  };
}
