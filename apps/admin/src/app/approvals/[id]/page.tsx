import {
  ApprovalHeader,
  CourseOverview,
  CurriculumStructure,
  InstructorNotes,
  ReviewActionCard,
  StatusTimeline,
  getApprovalById,
} from '@features/approval-management';
import { notFound } from 'next/navigation';

type ApprovalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApprovalDetailPage({ params }: ApprovalDetailPageProps) {
  const { id } = await params;
  const approval = getApprovalById(id);

  if (!approval) notFound();

  return (
    <>
      <ApprovalHeader
        title={approval.courseTitle}
        requestNumber={approval.requestNumber}
        submittedBy={approval.submittedBy}
        status={approval.status}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        {/* Main Column */}
        <div className="xl:col-span-8 flex flex-col gap-gutter">
          <CourseOverview
            imageUrl={approval.previewImageUrl}
            duration={approval.previewDuration}
            tags={approval.tags}
            description={approval.description}
          />
          <CurriculumStructure modules={approval.modules} />
          <InstructorNotes note={approval.instructorNote} />
        </div>

        {/* Side Column */}
        <div className="xl:col-span-4 flex flex-col gap-gutter">
          <ReviewActionCard />
          <StatusTimeline entries={approval.timeline} />
        </div>
      </div>
    </>
  );
}
