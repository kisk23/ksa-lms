// ── Components ────────────────────────────────────────────────────────────────
export { LessonPageClient } from './components/LessonPageClient';
export { VideoPlayer } from './components/VideoPlayer';
export { LessonHeader } from './components/LessonHeader';
export { CurriculumSidebar } from './components/CurriculumSidebar';
export { MarkCompleteButton } from './components/MarkCompleteButton';
export { LessonTabs } from './components/LessonTabs';
export { AssignmentList } from './components/AssignmentList';
export { LessonFiles } from './components/LessonFiles';

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useLesson } from './hooks/useLesson';
export { useMarkLessonComplete } from './hooks/useMarkLessonComplete';
export {
  useAssignments,
  useLessonFiles,
  useCourseProgress,
  useLessonStatuses,
} from './hooks/useQueries';
export { lessonKeys } from './hooks/lessonKeys';

// ── API ───────────────────────────────────────────────────────────────────────
export * from './api/lessonApi';

// ── Types ─────────────────────────────────────────────────────────────────────
export type * from './types';
