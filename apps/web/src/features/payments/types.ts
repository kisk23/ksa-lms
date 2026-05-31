export type PaymentStatus =
  | 'initiated'
  | 'paid'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed'
  | 'voided';

export type Payment = {
  id: string;
  orderId: string;
  moyasarPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  refundedAmount: number;
  capturedAmount: number;
  metadata: unknown;
  rawGatewayResponse: unknown;
  webhookEvents?: WebhookEvent[];
  courseId: string;
  studentUserId: string;
  payerUserId: string;
  course?: {
    id: string;
    title: string;
    teacherUserId: string;
    teacher?: { id: string; name: string; email: string };
  };
  student?: { id: string; name: string; email: string };
  payer?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
};

export type PaymentsList = {
  total: number;
  limit: number;
  offset: number;
  items: Payment[];
};

export type WebhookEvent = {
  id: string;
  eventId: string | null;
  paymentId: string | null;
  moyasarPaymentId: string | null;
  eventType: string;
  payload: unknown;
  processedAt: string;
};

export type CreatePaymentPayload = {
  orderId: string;
  amount: number;
  currency: string;
  studentUserId: string;
  courseId: string;
  description?: string;
  callbackUrl?: string;
  source?: {
    type: 'creditcard';
    name: string;
    number: string;
    month: number;
    year: number;
    cvc: string;
    manual?: boolean;
  };
  metadata?: Record<string, string>;
};
