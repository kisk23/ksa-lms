import type { Refund, RefundSummary } from '../types';

export const REFUND_SUMMARY: RefundSummary = {
  totalRequests: 142,
  pendingRequests: 12,
  refundedAmount: 4500,
};

export const MOCK_REFUNDS: Refund[] = [
  {
    id: '1',
    studentName: 'محمد العتيبي',
    studentInitial: 'م',
    studentEmail: 'm.otaibi@example.com',
    courseName: 'الفيزياء المتقدمة',
    courseCategory: 'science',
    amount: 450,
    reason: 'لم يعجبني المحتوى وطريقة الشرح غير واضحة',
    requestDate: '15 أكتوبر 2023',
    requestTime: '10:30 صباحاً',
    status: 'pending',
  },
  {
    id: '2',
    studentName: 'أروى خالد',
    studentInitial: 'أ',
    studentEmail: 'arwa.k@example.com',
    courseName: 'الكيمياء العضوية',
    courseCategory: 'science',
    amount: 300,
    reason: 'ظروف صحية تمنعني من إكمال الكورس',
    requestDate: '12 أكتوبر 2023',
    requestTime: '02:15 مساءً',
    status: 'approved',
  },
  {
    id: '3',
    studentName: 'فيصل محمد',
    studentInitial: 'ف',
    studentEmail: 'faisal.m@example.com',
    courseName: 'القدرات العامة',
    courseCategory: 'foundation',
    amount: 600,
    reason: 'تجاوزت المدة المسموحة للاسترجاع (14 يوم)',
    requestDate: '05 أكتوبر 2023',
    requestTime: '09:00 صباحاً',
    status: 'rejected',
  },
];
