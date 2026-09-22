import type { Metadata } from 'next';
import { AchievementsClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'الإنجازات ولوحة الشرف | سُلَّم',
  description: 'استعرض أوسمتك ونقاط الخبرة والمواظبة وترتيبك في لوحة الشرف على منصة سُلَّم.',
};

export default function AchievementsPage() {
  return <AchievementsClient />;
}
