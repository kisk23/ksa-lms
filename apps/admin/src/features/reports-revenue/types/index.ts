export interface DailyRevenue {
  day: number;
  date: string;
  sales: number;
  revenue: number;
  netProfit: number;
  percentage: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  revenueChange: number;
  successfulTransactions: number;
  transactionsChange: number;
  refunds: number;
  refundsChange: number;
  netProfit: number;
  netProfitChange: number;
}
