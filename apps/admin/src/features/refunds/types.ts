export type RefundStatus = 'pending' | 'approved' | 'rejected';
export type CourseCategory = 'science' | 'foundation' | 'humanities';
export type PaymentMethod = 'mada' | 'visa' | 'mastercard' | 'bank';

export interface Refund {
  id: string;
  studentName: string;
  studentInitial: string;
  studentEmail: string;
  courseName: string;
  courseCategory: CourseCategory;
  amount: number;
  reason: string;
  requestDate: string;
  requestTime: string;
  status: RefundStatus;
}

export interface RefundSummary {
  totalRequests: number;
  pendingRequests: number;
  refundedAmount: number;
}

export interface RefundFilters {
  search: string;
  status: RefundStatus | 'all';
}

// Detail page types
export interface RefundDetail extends Refund {
  requestNumber: string;
  studentIdNumber: string;
  purchaseDate: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  timeline: RefundTimelineEvent[];
}

export interface RefundTimelineEvent {
  id: string;
  title: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'pending';
}
