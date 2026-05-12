'use client';

import { ReportCard } from './ReportCard';
import { REPORT_CARDS } from '../data/mock-reports';

export function ReportsBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
      {REPORT_CARDS.map((card) => (
        <ReportCard key={card.id} card={card} />
      ))}
    </div>
  );
}
