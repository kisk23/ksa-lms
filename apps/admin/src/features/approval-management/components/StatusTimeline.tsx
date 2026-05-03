import { Timeline, type TimelineItem } from '@shared/components/ui/Timeline';

import type { TimelineEntry } from '../types';

type StatusTimelineProps = {
  entries: TimelineEntry[];
};

export function StatusTimeline({ entries }: StatusTimelineProps) {
  const items: TimelineItem[] = entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    meta: entry.meta,
    status: entry.status,
  }));

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md">
      <h2 className="font-h2-ar text-h2-ar text-on-background mb-md">سجل الحالة</h2>

      <Timeline items={items} />
    </div>
  );
}
