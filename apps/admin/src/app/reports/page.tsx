'use client';

import { ReportsHeader, ReportsBentoGrid } from '@/features/reports-overview';

export default function ReportsPage() {
  return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        <ReportsHeader />
        <ReportsBentoGrid />
      </div>
    </main>
  );
}
