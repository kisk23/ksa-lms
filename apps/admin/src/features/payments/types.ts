export type PaymentStatus = 'success' | 'failed' | 'refunded';
export type PaymentMethod = 'visa' | 'mastercard' | 'bank' | 'wallet';

export interface Payment {
  id: string;
  studentName: string;
  studentInitials: string;
  courseName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  status: PaymentStatus;
}

export interface PaymentSummary {
  totalRevenue: number;
  revenueChange: number;
  successfulTransactions: number;
  transactionsChange: number;
  refunds: number;
  refundsChange: number;
  netProfit: number;
  netProfitChange: number;
}

export interface PaymentFilters {
  search: string;
  dateRange: 'this_month' | 'last_month' | 'last_3_months' | 'custom';
  status: PaymentStatus | 'all';
  instructor: string | 'all';
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
  percentage: number;
}
