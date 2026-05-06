import type { Payment, PaymentSummary, MonthlyRevenue } from '../types';

export const PAYMENT_SUMMARY: PaymentSummary = {
  totalRevenue: 125000,
  revenueChange: 12.5,
  successfulTransactions: 850,
  transactionsChange: 5.2,
  refunds: 12,
  refundsChange: -2.1,
  netProfit: 118500,
  netProfitChange: 15.3,
};

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    studentName: 'عبدالله سالم',
    studentInitials: 'ع.س',
    courseName: 'الفيزياء المتقدمة - الصف الثالث الثانوي',
    amount: 450,
    paymentMethod: 'visa',
    date: '12 أكتوبر 2023',
    time: '10:30 صباحاً',
    status: 'success',
  },
  {
    id: '2',
    studentName: 'فاطمة محمد',
    studentInitials: 'ف.م',
    courseName: 'أساسيات البرمجة بلغة بايثون',
    amount: 300,
    paymentMethod: 'bank',
    date: '11 أكتوبر 2023',
    time: '02:15 مساءً',
    status: 'failed',
  },
  {
    id: '3',
    studentName: 'سالم عبدالله',
    studentInitials: 'س.ع',
    courseName: 'الرياضيات الشاملة',
    amount: 600,
    paymentMethod: 'wallet',
    date: '10 أكتوبر 2023',
    time: '09:00 صباحاً',
    status: 'refunded',
  },
];

export const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: 'يناير', amount: 60000, percentage: 40 },
  { month: 'فبراير', amount: 82500, percentage: 55 },
  { month: 'مارس', amount: 67500, percentage: 45 },
  { month: 'أبريل', amount: 90000, percentage: 60 },
  { month: 'مايو', amount: 75000, percentage: 50 },
  { month: 'يونيو', amount: 105000, percentage: 70 },
  { month: 'يوليو', amount: 97500, percentage: 65 },
  { month: 'أغسطس', amount: 127500, percentage: 85 },
  { month: 'سبتمبر', amount: 135000, percentage: 90 },
];
