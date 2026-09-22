import type { Metadata } from 'next';
import { SettingsClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'الإعدادات | سُلَّم',
  description: 'إدارة وتخصيص إعدادات حسابك وتفضيلات الأمان والتنبيهات على منصة سُلَّم.',
};

export default function SettingsPage() {
  return <SettingsClient />;
}
