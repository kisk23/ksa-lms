import { apiClient } from '@/shared/lib/api-client';
import type { StudentEnrollment, CourseProgress } from '../types';

export const dashboardService = {
  /**
   * Fetches the current logged-in student's enrollment history.
   * Scoped to the student's own ACTIVE, COMPLETED, EXPIRED, CANCELLED records.
   */
  async getMyEnrollments(): Promise<StudentEnrollment[]> {
    return apiClient.get<StudentEnrollment[]>('/enrollments/me');
  },

  /**
   * Fetches all course progress summaries for a student.
   */
  async getMyCourseProgress(studentId: string): Promise<CourseProgress[]> {
    return apiClient.get<CourseProgress[]>(`/students/${studentId}/progress/courses`);
  },

  /**
   * Fetches course progress summary for a specific course for the current student.
   */
  async getCourseProgress(courseId: string): Promise<CourseProgress | null> {
    return apiClient.get<CourseProgress | null>(`/progress/courses/${courseId}`);
  },

  /**
   * Fetches all lesson progress statuses in a course for the current student.
   */
  async getLessonStatuses(courseId: string): Promise<any[]> {
    return apiClient.get<any[]>(`/progress/courses/${courseId}/lessons`);
  },

  /**
   * Marks a lesson as completed for the current student.
   */
  async completeLesson(lessonId: string): Promise<any> {
    return apiClient.post<any>(`/progress/lessons/${lessonId}/complete`);
  },
};
