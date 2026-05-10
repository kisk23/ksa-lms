import type { PaymentStatus } from '../../generated/client';

export type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  refunded?: number;
  captured?: number;
  metadata?: Record<string, unknown> | null;
  source?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

export type CleanPaymentResponse = {
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
  createdAt: Date;
  updatedAt: Date;
};
