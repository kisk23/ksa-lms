import type { Metadata } from 'next';
import { CourseDashboardClient } from '@/features/dashboard';

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'منطقة دراسة الطالب | سُلَّم',
  description: 'متابعة دروس الطالب وإحصائيات تقدمه على منصة سُلَّم.',
};

export default function StudentCoursePage({ params }: PageProps) {
  return <CourseDashboardClient courseId={params.id} />;
}
