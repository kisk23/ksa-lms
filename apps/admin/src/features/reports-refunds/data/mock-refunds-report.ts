import type { RefundSummary } from '../types';

import { MOCK_REFUNDS as SOURCE_REFUNDS } from '@/features/refunds';
import type { Refund } from '@/features/refunds';

export const REFUND_SUMMARY: RefundSummary = {
  refundedAmount: 4500,
  refundRate: 3.8,
  pendingRequests: 12,
};

export const MOCK_REFUNDS: Refund[] = SOURCE_REFUNDS.slice(0, 10);

export const REFUND_REASONS = [
  { label: 'شراء بالخطأ', value: 45, color: '#2446b8' },
  { label: 'مشكلة تقنية', value: 25, color: '#dc2626' },
  { label: 'جودة المحتوى', value: 20, color: '#f97316' },
  { label: 'أخرى', value: 10, color: '#71717a' },
];
