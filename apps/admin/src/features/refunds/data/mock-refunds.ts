import type { Refund, RefundSummary, RefundDetail } from '../types';

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

export const MOCK_REFUND_DETAIL: RefundDetail = {
  id: '1',
  requestNumber: 'REF-8492',
  studentName: 'أحمد عبدالله محمد',
  studentInitial: 'أ',
  studentEmail: 'ahmed.am@example.com',
  studentIdNumber: '1098273645',
  courseName: 'الرياضيات المتقدمة - الصف الثالث ثانوي',
  courseCategory: 'science',
  amount: 450,
  purchaseDate: '2023-10-15',
  paymentMethod: 'mada',
  transactionId: 'TRX-9938-MAD-2023',
  reason: 'لم يعجبني المحتوى التعليمي ولم أجد الإجابات الكافية على تساؤلاتي خلال الحصص المباشرة',
  requestDate: '01 نوفمبر 2023',
  requestTime: '10:30 صباحاً',
  status: 'pending',
  timeline: [
    {
      id: 'event-1',
      title: 'بانتظار المراجعة',
      timestamp: 'الآن',
      status: 'current',
    },
    {
      id: 'event-2',
      title: 'تم استلام الطلب',
      timestamp: '2023-11-01 10:30 AM',
      status: 'completed',
    },
    {
      id: 'event-3',
      title: 'شراء الدورة',
      timestamp: '2023-10-15 08:15 PM',
      status: 'pending',
    },
  ],
};

export function getRefundById(id: string): RefundDetail | null {
  if (id === '1') return MOCK_REFUND_DETAIL;
  return null;
}
