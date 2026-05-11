export type ApprovalStatus = 'pending_review' | 'approved' | 'changes_requested' | 'rejected';

// New for list page
export type RequestType = 'new_course' | 'edit_course' | 'new_lesson';

export type ApprovalListItem = {
  id: string;
  requestType: RequestType;
  teacherName: string;
  teacherInitials: string;
  courseOrLessonName: string;
  requestDate: string;
  status: ApprovalStatus;
};

export type ApprovalStatusFilter = 'all' | ApprovalStatus;

// Existing detail types
export type LessonType = 'video' | 'assignment';

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
  durationLabel: string;
};

export type TimelineEntry = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  status: 'current' | 'past';
};

export type ApprovalRequest = {
  id: string;
  requestNumber: string;
  courseTitle: string;
  submittedBy: string;
  status: ApprovalStatus;
  previewImageUrl: string;
  previewDuration: string;
  tags: string[];
  description: string;
  modules: Module[];
  instructorNote: string;
  timeline: TimelineEntry[];
};
