import { History, Check } from 'lucide-react';

import type { RefundTimelineEvent } from '../types';

interface RefundTimelineProps {
  events: RefundTimelineEvent[];
}

export function RefundTimeline({ events }: RefundTimelineProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-surface-container-high h-full sticky top-margin">
      <h2 className="font-h2-ar text-h2-ar text-on-surface mb-md flex items-center gap-sm">
        <History className="w-5 h-5 text-primary" />
        سجل الطلب
      </h2>

      <div className="relative pl-xs">
        {/* Vertical Line */}
        <div className="absolute right-[11px] top-2 bottom-2 w-[2px] bg-surface-container-highest rounded-full" />

        <ul className="space-y-md relative z-10">
          {events.map((event) => (
            <li key={event.id} className="flex gap-sm">
              {/* Status Indicator */}
              {event.status === 'current' && (
                <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-primary flex-shrink-0 flex items-center justify-center mt-1 z-10">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              )}

              {event.status === 'completed' && (
                <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-1 z-10 shadow-sm shadow-primary/30">
                  <Check className="w-3.5 h-3.5 text-on-primary" />
                </div>
              )}

              {event.status === 'pending' && (
                <div className="w-6 h-6 rounded-full bg-surface-container-highest border-2 border-outline-variant flex-shrink-0 flex items-center justify-center mt-1 z-10" />
              )}

              {/* Content */}
              <div className={event.status === 'pending' ? 'opacity-60' : ''}>
                <p className="font-body-md-ar text-body-md-ar text-on-surface font-semibold">
                  {event.title}
                </p>
                {event.timestamp && (
                  <p className="font-caption-ar text-caption-ar text-outline font-label-en text-label-en mt-1">
                    {event.timestamp}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
