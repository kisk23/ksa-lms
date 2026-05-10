import { apiClient } from '@/shared/lib/api-client';

import type { CreatePaymentPayload, Payment, PaymentsList, WebhookEvent } from './types';

export const paymentsApi = {
  list: () => apiClient.get<PaymentsList>('/payments'),
  get: (id: string) => apiClient.get<Payment>(`/payments/${id}`),
  create: (payload: CreatePaymentPayload) =>
    apiClient.post<Payment>('/payments', payload, `payment-${payload.orderId}`),
  update: (id: string, payload: Partial<Pick<Payment, 'status' | 'metadata'>>) =>
    apiClient.patch<Payment>(`/payments/${id}`, payload),
  refund: (id: string, amount?: number) =>
    apiClient.post<Payment>(`/payments/${id}/refund`, amount ? { amount } : {}),
  capture: (id: string, amount?: number) =>
    apiClient.post<Payment>(`/payments/${id}/capture`, amount ? { amount } : {}),
  void: (id: string) => apiClient.post<Payment>(`/payments/${id}/void`),
  webhookEvents: () => apiClient.get<WebhookEvent[]>('/payments/webhook-events?limit=25'),
};
