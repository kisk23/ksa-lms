import type { Metadata } from 'next';
import { WalletClient } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'المحفظة | سُلَّم',
  description: 'إدارة الرصيد والمدفوعات وسجل المعاملات على منصة سُلَّم.',
};

export default function WalletPage() {
  return <WalletClient />;
}
