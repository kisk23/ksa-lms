'use client';

import { FormEvent, useState } from 'react';

import type { CreatePaymentPayload } from '../types';

const initialForm = {
  orderId: `ORDER-${Date.now()}`,
  amount: '19900',
  currency: 'SAR',
  studentUserId: '',
  courseId: '',
  name: 'Test User',
  number: '4111111111111111',
  month: '12',
  year: '2028',
  cvc: '123',
};

export function CreatePaymentForm({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (payload: CreatePaymentPayload) => void;
  isLoading: boolean;
  error?: string;
}) {
  const [form, setForm] = useState(initialForm);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      orderId: form.orderId,
      amount: Number(form.amount),
      currency: form.currency,
      studentUserId: form.studentUserId,
      courseId: form.courseId,
      description: `LMS checkout ${form.orderId}`,
      callbackUrl: typeof window !== 'undefined' ? `${window.location.origin}/payments` : undefined,
      source: {
        type: 'creditcard',
        name: form.name,
        number: form.number.replace(/\s/g, ''),
        month: Number(form.month),
        year: Number(form.year),
        cvc: form.cvc,
        manual: true,
      },
      metadata: { channel: 'dashboard' },
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-950">Create Payment</h2>
        <p className="text-sm text-zinc-500">Amounts are sent to Moyasar in halalas.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Order ID"
          value={form.orderId}
          onChange={(value) => update('orderId', value)}
        />
        <Input label="Amount" value={form.amount} onChange={(value) => update('amount', value)} />
        <Input
          label="Student User ID"
          value={form.studentUserId}
          onChange={(value) => update('studentUserId', value)}
        />
        <Input
          label="Course ID"
          value={form.courseId}
          onChange={(value) => update('courseId', value)}
        />
        <Input label="Cardholder" value={form.name} onChange={(value) => update('name', value)} />
        <Input
          label="Card Number"
          value={form.number}
          onChange={(value) => update('number', value)}
        />
        <Input label="Month" value={form.month} onChange={(value) => update('month', value)} />
        <Input label="Year" value={form.year} onChange={(value) => update('year', value)} />
        <Input label="CVC" value={form.cvc} onChange={(value) => update('cvc', value)} />
      </div>

      {error ? <p className="mt-3 rounded bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

      <button
        disabled={isLoading}
        className="mt-4 w-full rounded bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create sandbox payment'}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      />
    </label>
  );
}
