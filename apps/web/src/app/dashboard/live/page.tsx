import type { Metadata } from 'next';
import { LiveSessionsClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'الجلسات المباشرة | سُلَّم',
  description: 'متابعة وحضور الجلسات التعليمية التفاعلية المباشرة على منصة سُلَّم.',
};

export default function StudentLiveSessionsPage() {
  return <LiveSessionsClient />;
}
