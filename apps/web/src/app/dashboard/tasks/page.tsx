import type { Metadata } from 'next';
import { TasksClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'الواجبات والمهام | سُلَّم',
  description: 'متابعة وتسليم الواجبات الدراسية والمهام المطلوبة على منصة سُلَّم.',
};

export default function StudentTasksPage() {
  return <TasksClient />;
}
