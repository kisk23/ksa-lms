import type { Refund } from '@/features/refunds';

export type DateRange = 'last_30' | 'month' | 'quarter';

export interface RefundsReportFilters {
  dateRange: DateRange;
  searchText: string;
}

export interface RefundSummary {
  refundedAmount: number;
  refundRate: number;
  pendingRequests: number;
}

export interface RefundReason {
  label: string;
  value: number;
  color: string;
}

export type { Refund };
