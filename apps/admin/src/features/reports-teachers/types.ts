export type SubjectCategory = 'all' | 'math' | 'physics' | 'arabic' | 'english';
export type DateRange = 'last_30' | 'last_60' | 'last_90' | 'custom';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  subjectAr: string;
  image: string;
  studentCount: number;
  rating: number;
  totalEarnings: number;
  rank: number;
}

export interface TeacherPerformanceMetric {
  label: string;
  teacher1: number;
  teacher2: number;
  teacher3: number;
}

export interface TeachersReportSummary {
  totalTeachers: number;
  averageRating: number;
  topEarner: number;
  totalStudents: number;
}

export interface TeachersReportFilters {
  subject: SubjectCategory;
  dateRange: DateRange;
}
