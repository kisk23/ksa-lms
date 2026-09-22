import type { Metadata } from 'next';
import { ReportsClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'التقارير الأكاديمية | سُلَّم',
  description: 'مراجعة أدائك الدراسي والدرجات والمعدل التراكمي ونسب الحضور على منصة سُلَّم.',
};

export default function ReportsPage() {
  return <ReportsClient />;
}
