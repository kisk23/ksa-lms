'use client';

import type {
  MonthlyRevenue,
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
} from '@features/payments';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { apiClient } from '@/shared/lib/api-client';

const ITEMS_PER_PAGE = 10;

const EMPTY_SUMMARY: PaymentSummary = {
  totalRevenue: 0,
  revenueChange: 0,
  successfulTransactions: 0,
  transactionsChange: 0,
  refunds: 0,
  refundsChange: 0,
  netProfit: 0,
  netProfitChange: 0,
};

type ApiPaymentMethod = 'CREDIT_CARD' | 'MADA' | 'APPLE_PAY' | 'OFFLINE';

type ApiUser = {
  id: string;
  name: string;
  email: string;
};

type ApiCourse = {
  id: string;
  title: string;
  price?: number | string;
  currency?: string;
  teacherUserId?: string;
  teacher?: ApiUser;
};

type ApiPayment = {
  id: string;
  orderId: string;
  moyasarPaymentId: string | null;
  paymentMethod?: ApiPaymentMethod | null;
  amount: number;
  currency: string;
  status: PaymentGatewayStatus;
  refundedAmount: number;
  capturedAmount: number;
  metadata: unknown;
  rawGatewayResponse: unknown;
  webhookEvents?: WebhookEvent[];
  payer?: ApiUser;
  student?: ApiUser;
  course?: ApiCourse;
  createdAt: string;
  updatedAt: string;
};

type ApiPaymentsList = {
  total: number;
  limit: number;
  offset: number;
  items: ApiPayment[];
};

type WebhookEvent = {
  id: string;
  eventId: string | null;
  paymentId: string | null;
  moyasarPaymentId: string | null;
  eventType: string;
  processedAt: string;
};

type LoadState = 'idle' | 'loading' | 'success' | 'error';

type UpdateForm = {
  status: PaymentGatewayStatus;
  description: string;
  metadata: string;
};

type PaymentActionForm = {
  paymentId: string;
  type: 'refund' | 'capture';
  amount: string;
  reason: string;
};

type CreatePaymentForm = {
  orderId: string;
  amount: string;
  currency: string;
  studentUserId: string;
  courseId: string;
  description: string;
  cardName: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvc: string;
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

function arrayFromResponse<T>(response: T[] | { items?: T[]; data?: T[] }) {
  if (Array.isArray(response)) return response;
  return response.items ?? response.data ?? [];
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
  if (payment.paymentMethod === 'MADA' || payment.paymentMethod === 'OFFLINE') return 'bank';
  if (payment.paymentMethod === 'APPLE_PAY') return 'wallet';
  if (payment.paymentMethod === 'CREDIT_CARD') return 'visa';

  const rawGatewayResponse = isRecord(payment.rawGatewayResponse) ? payment.rawGatewayResponse : {};
  const source = isRecord(rawGatewayResponse.source) ? rawGatewayResponse.source : {};
  const method = stringFromRecord(source, ['company', 'type']) ?? '';
  const normalized = method.toLowerCase();

  if (normalized.includes('master')) return 'mastercard';
  if (normalized.includes('mada')) return 'bank';
  if (normalized.includes('apple')) return 'wallet';

  return 'visa';
}

function mapApiPayment(payment: ApiPayment): Payment {
  const metadata = isRecord(payment.metadata) ? payment.metadata : {};
  const { date, time } = formatApiDate(payment.createdAt);
  const studentName =
    payment.student?.name ??
    stringFromRecord(metadata, ['studentName', 'student_name', 'student']) ??
    `Student ${payment.orderId}`;
  const courseName =
    payment.course?.title ??
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

function dateRangeParams(filters: PaymentFilters) {
  const now = new Date();
  let start: Date | undefined;
  let end: Date | undefined;

  if (filters.dateRange === 'this_month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = now;
  }

  if (filters.dateRange === 'last_month') {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  }

  if (filters.dateRange === 'last_3_months') {
    start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    end = now;
  }

  if (filters.dateRange === 'custom') {
    start = filters.customDateFrom ? new Date(`${filters.customDateFrom}T00:00:00`) : undefined;
    end = filters.customDateTo ? new Date(`${filters.customDateTo}T23:59:59.999`) : undefined;
  }

  return { start, end };
}

function buildPaymentsParams(filters: PaymentFilters, page?: number) {
  const params = new URLSearchParams();
  const { start, end } = dateRangeParams(filters);

  if (page) {
    params.set('limit', String(ITEMS_PER_PAGE));
    params.set('offset', String((page - 1) * ITEMS_PER_PAGE));
  }

  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.instructor !== 'all') params.set('instructorId', filters.instructor);
  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (start) params.set('dateFrom', start.toISOString());
  if (end) params.set('dateTo', end.toISOString());

  return params;
}

function updateFormFromPayment(payment: ApiPayment): UpdateForm {
  return {
    status: payment.status,
    description: '',
    metadata: isRecord(payment.metadata) ? JSON.stringify(payment.metadata, null, 2) : '{}',
  };
}

function amountToHalalas(amount: string) {
  return Math.round(Number(amount) * 100);
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
  const [summary, setSummary] = useState<PaymentSummary>(EMPTY_SUMMARY);
  const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [students, setStudents] = useState<ApiUser[]>([]);
  const [instructors, setInstructors] = useState<ApiUser[]>([]);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ApiPayment | null>(null);
  const [editingPayment, setEditingPayment] = useState<ApiPayment | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateForm | null>(null);
  const [actionForm, setActionForm] = useState<PaymentActionForm | null>(null);
  const [busyPaymentId, setBusyPaymentId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreatePaymentForm>({
    orderId: '',
    amount: '',
    currency: 'SAR',
    studentUserId: '',
    courseId: '',
    description: '',
    cardName: 'Test User',
    cardNumber: '4111111111111111',
    cardMonth: '12',
    cardYear: '2028',
    cardCvc: '123',
  });

  const loadPayments = useCallback(async () => {
    setLoadState('loading');
    setErrorMessage(null);

    try {
      const listParams = buildPaymentsParams(filters, currentPage);
      const reportParams = buildPaymentsParams(filters);
      const revenueParams = new URLSearchParams(reportParams);
      revenueParams.set('year', String(revenueYear));

      // Added API wiring: GET /payments now supports server pagination and real search/date/instructor filters.
      const [list, nextSummary, nextRevenue] = await Promise.all([
        apiClient.get<ApiPaymentsList>(`/payments?${listParams.toString()}`),
        apiClient.get<PaymentSummary>(`/payments/summary?${reportParams.toString()}`),
        apiClient.get<MonthlyRevenue[]>(`/payments/revenue?${revenueParams.toString()}`),
      ]);

      setPayments(list.items.map(mapApiPayment));
      setTotalItems(list.total);
      setSummary(nextSummary);
      setRevenue(nextRevenue);
      setLoadState('success');
    } catch (error) {
      setPayments([]);
      setTotalItems(0);
      setLoadState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load payments');
    }
  }, [currentPage, filters, revenueYear]);

  const loadWebhookEvents = useCallback(async () => {
    try {
      // Added API wiring: GET /payments/webhook-events powers the admin webhook log.
      setWebhookEvents(await apiClient.get<WebhookEvent[]>('/payments/webhook-events?limit=25'));
    } catch {
      setWebhookEvents([]);
    }
  }, []);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    async function loadReferenceData() {
      try {
        const [studentResponse, teacherResponse, courseResponse] = await Promise.all([
          apiClient.get<ApiUser[] | { items?: ApiUser[]; data?: ApiUser[] }>(
            '/admin/users?role=STUDENT&limit=100',
          ),
          apiClient.get<ApiUser[] | { items?: ApiUser[]; data?: ApiUser[] }>(
            '/admin/users?role=TEACHER&limit=100',
          ),
          apiClient.get<ApiCourse[] | { items?: ApiCourse[]; data?: ApiCourse[] }>(
            '/courses/manage?limit=100',
          ),
        ]);

        const nextStudents = arrayFromResponse(studentResponse);
        const nextInstructors = arrayFromResponse(teacherResponse);
        const nextCourses = arrayFromResponse(courseResponse);

        setStudents(nextStudents);
        setInstructors(nextInstructors);
        setCourses(nextCourses);
        setCreateForm((prev) => ({
          ...prev,
          studentUserId: prev.studentUserId || nextStudents[0]?.id || '',
          courseId: prev.courseId || nextCourses[0]?.id || '',
        }));
      } catch {
        setStudents([]);
        setInstructors([]);
        setCourses([]);
      }
    }

    void loadReferenceData();
    void loadWebhookEvents();
  }, [loadWebhookEvents]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

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

  const handleOpenAction = (paymentId: string, type: PaymentActionForm['type']) => {
    setActionForm({ paymentId, type, amount: '', reason: '' });
  };

  const handleSubmitAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!actionForm) return;

    const amount = actionForm.amount ? amountToHalalas(actionForm.amount) : undefined;
    if (amount !== undefined && (!Number.isFinite(amount) || amount < 1)) {
      alert('Amount must be greater than 0');
      return;
    }

    setBusyPaymentId(actionForm.paymentId);

    try {
      const payload = {
        ...(amount && { amount }),
        ...(actionForm.reason.trim() && { reason: actionForm.reason.trim() }),
      };
      const endpoint =
        actionForm.type === 'refund'
          ? `/payments/${actionForm.paymentId}/refund`
          : `/payments/${actionForm.paymentId}/capture`;

      // Added API wiring: POST refund/capture sends optional amount and reason from PaymentActionDto.
      await apiClient.post<ApiPayment>(endpoint, payload);
      setActionForm(null);
      await loadPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : `Failed to ${actionForm.type} payment`);
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

  const handleCreatePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = amountToHalalas(createForm.amount);

    if (
      !createForm.orderId ||
      !createForm.studentUserId ||
      !createForm.courseId ||
      !createForm.cardName ||
      !createForm.cardNumber ||
      !createForm.cardMonth ||
      !createForm.cardYear ||
      !createForm.cardCvc ||
      amount < 100
    ) {
      alert('Order, student, course, card details, and amount are required.');
      return;
    }

    try {
      // Added API wiring: POST /payments lets admins create a payment from this page.
      await apiClient.post<ApiPayment>('/payments', {
        orderId: createForm.orderId,
        amount,
        currency: createForm.currency,
        studentUserId: createForm.studentUserId,
        courseId: createForm.courseId,
        description: createForm.description || undefined,
        callbackUrl:
          typeof window !== 'undefined' ? `${window.location.origin}/payments` : undefined,
        source: {
          type: 'creditcard',
          name: createForm.cardName,
          number: createForm.cardNumber.replace(/\s/g, ''),
          month: Number(createForm.cardMonth),
          year: Number(createForm.cardYear),
          cvc: createForm.cardCvc,
          manual: true,
        },
        metadata: { channel: 'admin' },
      });

      setCreateForm((prev) => ({
        ...prev,
        orderId: '',
        amount: '',
        description: '',
        cardCvc: '',
      }));
      await loadPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create payment');
    }
  };

  return (
    <main className="flex-1 p-margin pt-24 space-y-md">
      <PaymentsHeader />

      <PaymentsSummaryCards summary={summary} />

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
        <h2 className="font-h2-ar text-h2-ar text-on-surface mb-4">Create payment</h2>
        <form onSubmit={handleCreatePayment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={createForm.orderId}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, orderId: event.target.value }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
            placeholder="Order ID"
          />
          <select
            value={createForm.studentUserId}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, studentUserId: event.target.value }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <select
            value={createForm.courseId}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, courseId: event.target.value }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            step="0.01"
            value={createForm.amount}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, amount: event.target.value }))}
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
            placeholder="Amount in SAR"
          />
          <input
            type="text"
            value={createForm.currency}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
            maxLength={3}
            placeholder="SAR"
          />
          <input
            type="text"
            value={createForm.description}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
            placeholder="Description"
          />
          <input
            type="text"
            value={createForm.cardName}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, cardName: event.target.value }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
            placeholder="Cardholder"
          />
          <input
            type="text"
            value={createForm.cardNumber}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, cardNumber: event.target.value }))
            }
            className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
            placeholder="Card number"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={createForm.cardMonth}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, cardMonth: event.target.value }))
              }
              className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
              placeholder="MM"
            />
            <input
              type="text"
              value={createForm.cardYear}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, cardYear: event.target.value }))
              }
              className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
              placeholder="YYYY"
            />
            <input
              type="text"
              value={createForm.cardCvc}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, cardCvc: event.target.value }))
              }
              className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
              placeholder="CVC"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-medium"
            >
              Create payment
            </button>
          </div>
        </form>
      </section>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <PaymentsFilters
          filters={filters}
          instructors={instructors}
          onFiltersChange={handleFiltersChange}
        />

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
          onRefund={(id) => handleOpenAction(id, 'refund')}
          onCapture={(id) => handleOpenAction(id, 'capture')}
          onVoid={handleVoid}
          onUpdate={handleUpdatePayment}
          busyPaymentId={busyPaymentId}
        />
      </div>

      {actionForm && (
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-h2-ar text-h2-ar text-on-surface">
              {actionForm.type === 'refund' ? 'Refund payment' : 'Capture payment'}
            </h2>
            <button
              type="button"
              onClick={() => setActionForm(null)}
              className="text-sm text-primary-container hover:underline"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmitAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={actionForm.amount}
              onChange={(event) =>
                setActionForm((prev) => (prev ? { ...prev, amount: event.target.value } : prev))
              }
              className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm"
              placeholder="Optional amount in SAR"
            />
            <input
              type="text"
              value={actionForm.reason}
              onChange={(event) =>
                setActionForm((prev) => (prev ? { ...prev, reason: event.target.value } : prev))
              }
              className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm md:col-span-2"
              placeholder="Optional reason"
            />
            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={busyPaymentId === actionForm.paymentId}
                className="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      )}

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
              <dt className="text-outline">Student</dt>
              <dd className="text-on-surface font-medium">
                {selectedPayment.student?.name ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-outline">Course</dt>
              <dd className="text-on-surface font-medium">
                {selectedPayment.course?.title ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-outline">Instructor</dt>
              <dd className="text-on-surface font-medium">
                {selectedPayment.course?.teacher?.name ?? '-'}
              </dd>
            </div>
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
              <dt className="text-outline">Method</dt>
              <dd className="text-on-surface font-medium">
                {selectedPayment.paymentMethod ?? '-'}
              </dd>
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

      <RevenueChart data={revenue} selectedYear={revenueYear} onYearChange={setRevenueYear} />

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-h2-ar text-h2-ar text-on-surface">Webhook events</h2>
          <button
            type="button"
            onClick={() => void loadWebhookEvents()}
            className="text-sm text-primary-container hover:underline"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-outline border-b border-outline-variant">
              <tr>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Moyasar ID</th>
                <th className="py-2 px-3">Payment ID</th>
                <th className="py-2 px-3">Processed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {webhookEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 px-3 text-center text-on-surface-variant">
                    No webhook events.
                  </td>
                </tr>
              ) : (
                webhookEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="py-2 px-3">{event.eventType}</td>
                    <td className="py-2 px-3">{event.moyasarPaymentId ?? '-'}</td>
                    <td className="py-2 px-3">{event.paymentId ?? '-'}</td>
                    <td className="py-2 px-3">{formatApiDate(event.processedAt).date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
