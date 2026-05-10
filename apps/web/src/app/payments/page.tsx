'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { CreatePaymentForm } from '@/features/payments/components/CreatePaymentForm';
import { PaymentDetailsModal } from '@/features/payments/components/PaymentDetailsModal';
import { PaymentTable } from '@/features/payments/components/PaymentTable';
import { WebhookEventLog } from '@/features/payments/components/WebhookEventLog';
import { paymentsApi } from '@/features/payments/payments.api';
import type { CreatePaymentPayload, Payment } from '@/features/payments/types';

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [busyId, setBusyId] = useState<string>();

  const paymentsQuery = useQuery({ queryKey: ['payments'], queryFn: paymentsApi.list });
  const webhooksQuery = useQuery({
    queryKey: ['payment-webhooks'],
    queryFn: paymentsApi.webhookEvents,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreatePaymentPayload) => paymentsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });

  const actionMutation = useMutation({
    mutationFn: async (action: { type: 'refund' | 'capture' | 'void'; payment: Payment }) => {
      setBusyId(action.payment.id);
      if (action.type === 'refund') return paymentsApi.refund(action.payment.id);
      if (action.type === 'capture') return paymentsApi.capture(action.payment.id);
      return paymentsApi.void(action.payment.id);
    },
    onSettled: () => {
      setBusyId(undefined);
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold">Moyasar Payments</h1>
            <p className="text-sm text-zinc-500">
              Sandbox charge, capture, refund, void, and webhook monitoring.
            </p>
          </div>
          <a
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            href="/checkout/mock"
          >
            Mock checkout
          </a>
        </div>

        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          <CreatePaymentForm
            onSubmit={(payload) => createMutation.mutate(payload)}
            isLoading={createMutation.isPending}
            error={createMutation.error?.message}
          />

          <div className="space-y-4">
            {paymentsQuery.isLoading ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
                Loading payments...
              </div>
            ) : paymentsQuery.error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
                {paymentsQuery.error.message}
              </div>
            ) : (
              <PaymentTable
                payments={paymentsQuery.data?.items ?? []}
                onOpen={setSelectedPayment}
                onRefund={(payment) => actionMutation.mutate({ type: 'refund', payment })}
                onCapture={(payment) => actionMutation.mutate({ type: 'capture', payment })}
                onVoid={(payment) => actionMutation.mutate({ type: 'void', payment })}
                busyId={busyId}
              />
            )}

            {actionMutation.error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {actionMutation.error.message}
              </div>
            ) : null}

            <WebhookEventLog
              events={webhooksQuery.data ?? []}
              isLoading={webhooksQuery.isLoading}
            />
          </div>
        </div>
      </div>

      <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </main>
  );
}
