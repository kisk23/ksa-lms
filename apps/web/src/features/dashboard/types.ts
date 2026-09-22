export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';

export interface CourseProgress {
  id: string;
  studentUserId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPct: number;
  lastLessonId?: string | null;
  lastLesson?: {
    id: string;
    title: string;
    orderIndex: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentEnrollment {
  id: string;
  studentUserId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  expiryDate?: string | null;
  amountPaid: string | number;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    category?: string | null;
    teacher: {
      id: string;
      name: string;
    };
  };
  // Client-side merged progress
  progress?: CourseProgress | null;
}

export interface DashboardStats {
  enrolledCount: number;
  completedCount: number;
  inProgressCount: number;
  totalXp: number;
}
