'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

import { paymentsApi } from '@/features/payments/payments.api';

const testCards = [
  { label: 'Successful Visa', number: '4111111111111111', cvc: '123' },
  { label: '3-D Secure flow', number: '4000000000000002', cvc: '123' },
  { label: 'Declined card', number: '4000000000009995', cvc: '123' },
];

export default function MockCheckoutPage() {
  const [studentUserId, setStudentUserId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [card, setCard] = useState(testCards[0]);

  const mutation = useMutation({
    mutationFn: () =>
      paymentsApi.create({
        orderId: `CHECKOUT-${Date.now()}`,
        amount: 19900,
        currency: 'SAR',
        studentUserId,
        courseId,
        description: 'Mock LMS checkout',
        callbackUrl: `${window.location.origin}/payments`,
        source: {
          type: 'creditcard',
          name: 'LMS Sandbox User',
          number: card.number,
          month: 12,
          year: 2028,
          cvc: card.cvc,
          manual: true,
        },
        metadata: { checkout: 'mock' },
      }),
  });

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 text-zinc-950">
      <div className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Mock Checkout</h1>
            <p className="text-sm text-zinc-500">
              Use Moyasar sandbox cards against the local API.
            </p>
          </div>
          <Link
            className="rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
            href="/payments"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Student User ID" value={studentUserId} onChange={setStudentUserId} />
          <Field label="Course ID" value={courseId} onChange={setCourseId} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {testCards.map((item) => (
            <button
              key={item.number}
              onClick={() => setCard(item)}
              className={`rounded border p-3 text-left text-sm ${
                card.number === item.number
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span className="block font-semibold">{item.label}</span>
              <span className="mt-1 block opacity-70">{item.number}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Python Basics</p>
              <p className="text-sm text-zinc-500">One-time course access</p>
            </div>
            <p className="text-lg font-semibold">199.00 SAR</p>
          </div>
        </div>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !studentUserId || !courseId}
          className="mt-5 w-full rounded bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {mutation.isPending ? 'Processing...' : 'Pay with sandbox card'}
        </button>

        {mutation.error ? (
          <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">
            {mutation.error.message}
          </p>
        ) : null}
        {mutation.data ? (
          <pre className="mt-4 overflow-auto rounded bg-zinc-950 p-4 text-xs text-zinc-100">
            {JSON.stringify(mutation.data, null, 2)}
          </pre>
        ) : null}
      </div>
    </main>
  );
}

function Field({
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
        className="w-full rounded border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
      />
    </label>
  );
}
