import type { Metadata } from 'next';
import { GradedAssignmentClient, AssignmentSubmissionClient } from '@/features/dashboard';

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'تفاصيل الواجب | سُلَّم',
  description: 'حل وتسليم الواجبات الدراسية أو مراجعة تقييماتها وملاحظات المعلمين على منصة سُلَّم.',
};

export default function GradedAssignmentPage({ params }: PageProps) {
  // Simulating status routing:
  // - IDs '1' (Pending Physics) & '4' (Late Arabic) render the active Submission workspace
  // - IDs '2' (Submitted Math) & '3' (Graded Chemistry) render the Graded details feedback
  const isPendingState = params.id === '1' || params.id === '4';

  if (isPendingState) {
    return <AssignmentSubmissionClient assignmentId={params.id} />;
  }

  return <GradedAssignmentClient assignmentId={params.id} />;
}
