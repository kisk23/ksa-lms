// ─────────────────────────────────────────
// Dashboard Feature — Public API
// ─────────────────────────────────────────

export * from './types';
export { dashboardService } from './services/dashboard.service';
export { useStudentDashboard } from './hooks/useDashboard';
export { useCourseDashboard } from './hooks/useCourseDashboard';

// Components
export { SideNavBar } from './components/SideNavBar';
export { TopAppBar } from './components/TopAppBar';
export { DashboardStats } from './components/DashboardStats';
export { EnrolledCourses } from './components/EnrolledCourses';
export { EnrolledCourseCard } from './components/EnrolledCourseCard';
export { CourseDashboardClient } from './components/CourseDashboardClient';
export { LiveSessionsClient } from './components/LiveSessionsClient';
export { TasksClient } from './components/TasksClient';
export { GradedAssignmentClient } from './components/GradedAssignmentClient';
export { AssignmentSubmissionClient } from './components/AssignmentSubmissionClient';
export { QuizzesClient } from './components/QuizzesClient';
export { QuizTakerClient } from './components/QuizTakerClient';
export { QuizResultClient } from './components/QuizResultClient';
export { WalletClient } from './components/WalletClient';
export { SettingsClient } from './components/SettingsClient';
export { AchievementsClient } from './components/AchievementsClient';
export { CalendarClient } from './components/CalendarClient';
export { ReportsClient } from './components/ReportsClient';
