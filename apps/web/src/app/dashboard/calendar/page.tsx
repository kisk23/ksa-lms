import type { Metadata } from 'next';
import { CalendarClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'الجدول الدراسي | سُلَّم',
  description:
    'استعرض مواعيد الحصص المباشرة والواجبات والاختبارات المجدولة في تقويمك الدراسي على منصة سُلَّم.',
};

export default function CalendarPage() {
  return <CalendarClient />;
}
