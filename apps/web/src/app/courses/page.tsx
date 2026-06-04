import type { Metadata } from 'next';

import { CoursesPageClient } from '@/features/courses/components/CoursesPageClient';

export const metadata: Metadata = {
  title:       'الدورات | سُلَّم',
  description: 'استعرض جميع الدورات التعليمية المتاحة على منصة سُلَّم',
};

export default function CoursesPage() {
  return <CoursesPageClient />;
}