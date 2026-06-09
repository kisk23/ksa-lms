export type ApprovalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';

export type RequestType = 'NEW_COURSE' | 'EDIT_COURSE' | 'NEW_LESSON';

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

// Represents exactly what the API returns for GET /approvals/:id
export type ApprovalRequest = {
  id: string;
  requestType: RequestType;
  status: ApprovalStatus;
  courseId: string;
  lessonId: string | null;
  requestedBy: string;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  requester: { id: string; name: string; email: string };
  reviewer: { id: string; name: string; email: string } | null;
  course: {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    chapters?: {
      id: string;
      title: string;
      lessons: { id: string; title: string; videoDuration?: number }[];
    }[];
  };
  lesson: { id: string; title: string } | null;
};
