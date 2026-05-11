// List page
export { ApprovalsHeader } from './components/ApprovalsHeader';
export { ApprovalsFilters } from './components/ApprovalsFilters';
export { ApprovalsTable } from './components/ApprovalsTable';

// Detail page
export { ApprovalHeader } from './components/ApprovalHeader';
export { CourseOverview } from './components/CourseOverview';
export { CurriculumStructure } from './components/CurriculumStructure';
export { InstructorNotes } from './components/InstructorNotes';
export { ReviewActionCard } from './components/ReviewActionCard';
export { StatusTimeline } from './components/StatusTimeline';

// Data
export {
  MOCK_APPROVALS_LIST,
  MOCK_APPROVAL,
  getApprovalById,
  getPendingApprovalsCount,
} from './data/mock-approval';

// Types
export type {
  ApprovalRequest,
  ApprovalListItem,
  ApprovalStatus,
  ApprovalStatusFilter,
  RequestType,
  Module,
  Lesson,
  TimelineEntry,
} from './types';
