'use client';

import type {
  Payment,
  PaymentFilters,
  PaymentGatewayStatus,
  PaymentMethod,
  PaymentSummary,
} from '@features/payments';
import {
  PaymentsHeader,
  PaymentsSummaryCards,
  PaymentsFilters,
  PaymentsTable,
  RevenueChart,
  MONTHLY_REVENUE,
} from '@features/payments';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiClient } from '@/shared/lib/api-client';

const ITEMS_PER_PAGE = 10;

type ApiPayment = {
  id: string;
  orderId: string;
  moyasarPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentGatewayStatus;
  refundedAmount: number;
  capturedAmount: number;
  metadata: unknown;
  rawGatewayResponse: unknown;
  createdAt: string;
  updatedAt: string;
};

type ApiPaymentsList = {
  total: number;
  limit: number;
  offset: number;
  items: ApiPayment[];
};

type LoadState = 'idle' | 'loading' | 'success' | 'error';

type UpdateForm = {
  status: PaymentGatewayStatus;
  description: string;
  metadata: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringFromRecord(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
  }

  return undefined;
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '--';

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('.');
}

function formatApiDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: '-', time: '-' };

  return {
    date: date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
  };
}

function mapApiStatus(status: PaymentGatewayStatus): Payment['status'] {
  if (status === 'refunded') return 'refunded';
  if (status === 'failed' || status === 'voided') return 'failed';

  return 'success';
}

function mapPaymentMethod(payment: ApiPayment): PaymentMethod {
  const metadata = isRecord(payment.metadata) ? payment.metadata : {};
  const rawGatewayResponse = isRecord(payment.rawGatewayResponse) ? payment.rawGatewayResponse : {};
  const source = isRecord(rawGatewayResponse.source) ? rawGatewayResponse.source : {};
  const method =
    stringFromRecord(metadata, ['paymentMethod', 'payment_method', 'method']) ??
    stringFromRecord(source, ['company', 'type']) ??
    '';
  const normalized = method.toLowerCase();

  if (normalized.includes('master')) return 'mastercard';
  if (normalized.includes('bank') || normalized.includes('mada')) return 'bank';
  if (normalized.includes('wallet') || normalized.includes('apple')) return 'wallet';

  return 'visa';
}

function mapApiPayment(payment: ApiPayment): Payment {
  const metadata = isRecord(payment.metadata) ? payment.metadata : {};
  const { date, time } = formatApiDate(payment.createdAt);
  const studentName =
    stringFromRecord(metadata, ['studentName', 'student_name', 'student']) ??
    `Student ${payment.orderId}`;
  const courseName =
    stringFromRecord(metadata, ['courseName', 'course_name', 'course', 'description']) ??
    `Order ${payment.orderId}`;

  return {
    id: payment.id,
    orderId: payment.orderId,
    moyasarPaymentId: payment.moyasarPaymentId,
    studentName,
    studentInitials: initialsFromName(studentName),
    courseName,
    amount: payment.amount / 100,
    currency: payment.currency,
    paymentMethod: mapPaymentMethod(payment),
    date,
    time,
    status: mapApiStatus(payment.status),
    gatewayStatus: payment.status,
  };
}

function buildPaymentsEndpoint(filters: PaymentFilters, page: number) {
  const params = new URLSearchParams({
    limit: String(ITEMS_PER_PAGE),
    offset: String((page - 1) * ITEMS_PER_PAGE),
  });

  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.search.trim()) params.set('orderId', filters.search.trim());

  return `/payments?${params.toString()}`;
}

function buildSummary(payments: Payment[]): PaymentSummary {
  const successfulPayments = payments.filter((payment) => payment.status === 'success');
  const refundedPayments = payments.filter((payment) => payment.status === 'refunded');
  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const refundedAmount = refundedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalRevenue,
    revenueChange: 0,
    successfulTransactions: successfulPayments.length,
    transactionsChange: 0,
    refunds: refundedPayments.length,
    refundsChange: 0,
    netProfit: totalRevenue - refundedAmount,
    netProfitChange: 0,
  };
}

function updateFormFromPayment(payment: ApiPayment): UpdateForm {
  return {
    status: payment.status,
    description: '',
    metadata: isRecord(payment.metadata) ? JSON.stringify(payment.metadata, null, 2) : '{}',
  };
}

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({
    search: '',
    dateRange: 'this_month',
    status: 'all',
    instructor: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ApiPayment | null>(null);
  const [editingPayment, setEditingPayment] = useState<ApiPayment | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateForm | null>(null);
  const [busyPaymentId, setBusyPaymentId] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setLoadState('loading');
    setErrorMessage(null);

    try {
      // Added API wiring: GET /payments with limit/offset/status/orderId from PaymentsController.listPayments.
      const response = await apiClient.get<ApiPaymentsList>(
        buildPaymentsEndpoint(filters, currentPage),
      );

      setPayments(response.items.map(mapApiPayment));
      setTotalItems(response.total);
      setLoadState('success');
    } catch (error) {
      setPayments([]);
      setTotalItems(0);
      setLoadState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load payments');
    }
  }, [currentPage, filters]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const summary = useMemo(() => buildSummary(payments), [payments]);

  const handleFiltersChange = (newFilters: Partial<PaymentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const fetchPayment = async (id: string) => {
    // Added API wiring: GET /payments/:id refreshes the local payment from Moyasar before showing/editing it.
    return apiClient.get<ApiPayment>(`/payments/${id}`);
  };

  const handleViewPayment = async (id: string) => {
    setBusyPaymentId(id);

    try {
      setSelectedPayment(await fetchPayment(id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load payment details');
    } finally {
      setBusyPaymentId(null);
    }
  };

  const handleUpdatePayment = async (id: string) => {
    setBusyPaymentId(id);

    try {
      const payment = await fetchPayment(id);
      setEditingPayment(payment);
      setUpdateForm(updateFormFromPayment(payment));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load payment for update');
    } finally {
      setBusyPaymentId(null);
    }
  };

  const handleRefund = async (id: string) => {
    if (!confirm('Refund this payment?')) return;

    setBusyPaymentId(id);

    try {
      // Added API wiring: POST /payments/:id/refund calls PaymentsController.refundPayment.
      await apiClient.post<ApiPayment>(`/payments/${id}/refund`, {});
      await loadPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to refund payment');
    } finally {
      setBusyPaymentId(null);
    }
  };

  const handleCapture = async (id: string) => {
    if (!confirm('Capture this authorized payment?')) return;

    setBusyPaymentId(id);

    try {
      // Added API wiring: POST /payments/:id/capture calls PaymentsController.capturePayment.
      await apiClient.post<ApiPayment>(`/payments/${id}/capture`, {});
      await loadPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to capture payment');
    } finally {
      setBusyPaymentId(null);
    }
  };

  const handleVoid = async (id: string) => {
    if (!confirm('Void this payment?')) return;

    setBusyPaymentId(id);

    try {
      // Added API wiring: POST /payments/:id/void calls PaymentsController.voidPayment.
      await apiClient.post<ApiPayment>(`/payments/${id}/void`);
      await loadPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to void payment');
    } finally {
      setBusyPaymentId(null);
    }
  };

  const handleSubmitUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPayment || !updateForm) return;

    let metadata: Record<string, string>;
    try {
      const parsed = JSON.parse(updateForm.metadata) as unknown;
      if (!isRecord(parsed)) throw new Error('Metadata must be a JSON object');
      metadata = Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [key, String(value)]),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Invalid metadata JSON');
      return;
    }

    setBusyPaymentId(editingPayment.id);

    try {
      // Added API wiring: PATCH /payments/:id sends UpdatePaymentDto status/description/metadata.
      const updated = await apiClient.patch<ApiPayment>(`/payments/${editingPayment.id}`, {
        status: updateForm.status,
        description: updateForm.description || undefined,
        metadata,
      });
      setSelectedPayment(updated);
      setEditingPayment(null);
      setUpdateForm(null);
      await loadPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update payment');
    } finally {
      setBusyPaymentId(null);
    }
  };

  return (
    <main className="flex-1 p-margin pt-24 space-y-md">
      <PaymentsHeader />

      <PaymentsSummaryCards summary={summary} />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <PaymentsFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {loadState === 'loading' && (
          <div className="px-4 py-3 text-sm text-on-surface-variant border-b border-outline-variant">
            Loading payments...
          </div>
        )}

        {loadState === 'error' && (
          <div className="px-4 py-3 text-sm text-error border-b border-outline-variant">
            {errorMessage}
          </div>
        )}

        <PaymentsTable
          payments={payments}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onViewPayment={handleViewPayment}
          onRefund={handleRefund}
          onCapture={handleCapture}
          onVoid={handleVoid}
          onUpdate={handleUpdatePayment}
          busyPaymentId={busyPaymentId}
        />
      </div>

      {selectedPayment && (
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-h2-ar text-h2-ar text-on-surface">Payment details</h2>
            <button
              type="button"
              onClick={() => setSelectedPayment(null)}
              className="text-sm text-primary-container hover:underline"
            >
              Close
            </button>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <dt className="text-outline">Order ID</dt>
              <dd className="text-on-surface font-medium">{selectedPayment.orderId}</dd>
            </div>
            <div>
              <dt className="text-outline">Moyasar ID</dt>
              <dd className="text-on-surface font-medium">
                {selectedPayment.moyasarPaymentId ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-outline">Status</dt>
              <dd className="text-on-surface font-medium">{selectedPayment.status}</dd>
            </div>
            <div>
              <dt className="text-outline">Amount</dt>
              <dd className="text-on-surface font-medium">
                {selectedPayment.amount / 100} {selectedPayment.currency}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {editingPayment && updateForm && (
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-h2-ar text-h2-ar text-on-surface">Update payment</h2>
            <button
              type="button"
              onClick={() => {
                setEditingPayment(null);
                setUpdateForm(null);
              }}
              className="text-sm text-primary-container hover:underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmitUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2 text-sm text-on-surface">
              Status
              <select
                value={updateForm.status}
                onChange={(event) =>
                  setUpdateForm((prev) =>
                    prev ? { ...prev, status: event.target.value as PaymentGatewayStatus } : prev,
                  )
                }
                className="bg-white border border-outline-variant rounded-lg py-2 px-3"
              >
                <option value="initiated">Initiated</option>
                <option value="paid">Paid</option>
                <option value="authorized">Authorized</option>
                <option value="captured">Captured</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
                <option value="voided">Voided</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-on-surface lg:col-span-2">
              Description
              <input
                type="text"
                value={updateForm.description}
                onChange={(event) =>
                  setUpdateForm((prev) =>
                    prev ? { ...prev, description: event.target.value } : prev,
                  )
                }
                className="bg-white border border-outline-variant rounded-lg py-2 px-3"
                placeholder="Optional Moyasar description"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-on-surface lg:col-span-3">
              Metadata JSON
              <textarea
                value={updateForm.metadata}
                onChange={(event) =>
                  setUpdateForm((prev) => (prev ? { ...prev, metadata: event.target.value } : prev))
                }
                className="min-h-32 bg-white border border-outline-variant rounded-lg py-2 px-3 font-mono text-xs text-left"
                dir="ltr"
              />
            </label>

            <div className="lg:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={busyPaymentId === editingPayment.id}
                className="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Save payment
              </button>
            </div>
          </form>
        </section>
      )}

      <RevenueChart data={MONTHLY_REVENUE} />
    </main>
  );
}
