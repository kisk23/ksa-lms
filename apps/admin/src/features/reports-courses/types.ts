export type CourseCategory = 'all' | 'math' | 'science' | 'english' | 'computer' | 'social';
export type DateRange = 'last_30' | 'last_60' | 'last_90' | 'custom';

export interface Course {
  id: string;
  title: string;
  category: string;
  categoryAr: string;
  instructor: string;
  image: string;
  studentCount: number;
  totalRevenue: number;
  pricePerStudent: number;
}

export interface TopCourse {
  title: string;
  studentCount: number;
  percentage: number;
}

export interface CourseReportSummary {
  totalCoursesSold: number;
  averagePrice: number;
  priceChange: number;
  totalRevenue: number;
  revenueChange: number;
}

export interface CoursesReportFilters {
  category: CourseCategory;
  dateRange: DateRange;
}
