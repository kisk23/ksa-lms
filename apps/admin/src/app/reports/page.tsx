'use client';

import { ReportsHeader, ReportsBentoGrid } from '@/features/reports-overview';

export default function ReportsPage() {
  return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC] p-margin pt-24 space-y-12">
      <div className="max-w-7xl mx-auto">
        <ReportsHeader />
        <ReportsBentoGrid />
      </div>
    </main>
  );
}
