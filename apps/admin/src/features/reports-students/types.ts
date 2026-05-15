export type DateRange = 'last_30' | 'last_60' | 'last_90';

export interface StudentsReportFilters {
  dateRange: DateRange;
}

export interface StudentsReportSummary {
  avgSessionDuration: string;
  sessionChange: number;
  completionRate: number;
  liveSessions: number;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  course: string;
  progress: number;
  lastActivity: string;
  avatar?: string;
  initials: string;
  courseBadgeColor: string;
}
