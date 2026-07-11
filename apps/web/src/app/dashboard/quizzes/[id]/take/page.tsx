import type { Metadata } from 'next';
import { QuizTakerClient } from '@/features/dashboard';

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'الاختبار | سُلَّم',
  description: 'بيئة الاختبار التفاعلية على منصة سُلَّم.',
};

export default function QuizTakerPage({ params }: PageProps) {
  return <QuizTakerClient />;
}
