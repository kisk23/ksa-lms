import type { Metadata } from 'next';
import { QuizzesClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'الاختبارات | سُلَّم',
  description: 'استعرض اختباراتك القادمة وراجع نتائج الاختبارات السابقة على منصة سُلَّم.',
};

export default function QuizzesPage() {
  return <QuizzesClient />;
}
