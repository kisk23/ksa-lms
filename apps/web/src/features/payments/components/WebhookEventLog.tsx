'use client';

import type { WebhookEvent } from '../types';

export function WebhookEventLog({
  events,
  isLoading,
}: {
  events: WebhookEvent[];
  isLoading: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-950">Webhook Events</h2>
        {isLoading ? <span className="text-xs text-zinc-500">Loading...</span> : null}
      </div>
      <div className="space-y-2">
        {events.map((event) => (
          <details key={event.id} className="rounded border border-zinc-200 p-3 text-sm">
            <summary className="cursor-pointer font-medium text-zinc-800">
              {event.eventType}{' '}
              <span className="text-zinc-400">{new Date(event.processedAt).toLocaleString()}</span>
            </summary>
            <pre className="mt-3 max-h-56 overflow-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </details>
        ))}
        {!events.length ? (
          <p className="py-6 text-center text-sm text-zinc-500">No webhook events recorded.</p>
        ) : null}
      </div>
    </div>
  );
}
