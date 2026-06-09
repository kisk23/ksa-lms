'use client';

import { RevenueReportDetail } from '@/features/reports-revenue/components/RevenueReportDetail';

export default function RevenueDetailPage() {
  return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
        {/* Revenue Detail */}
        <RevenueReportDetail />
      </div>
    </main>
  );
}
