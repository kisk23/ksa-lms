export type PaymentStatus = 'success' | 'failed' | 'refunded';
export type PaymentGatewayStatus =
  | 'initiated'
  | 'paid'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed'
  | 'voided';
export type PaymentMethod = 'visa' | 'mastercard' | 'bank' | 'wallet';

export interface Payment {
  id: string;
  orderId?: string;
  moyasarPaymentId?: string | null;
  studentName: string;
  studentInitials: string;
  courseName: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  status: PaymentStatus;
  gatewayStatus?: PaymentGatewayStatus;
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
  status: PaymentGatewayStatus | 'all';
  instructor: string | 'all';
  customDateFrom?: string;
  customDateTo?: string;
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
  percentage: number;
}
