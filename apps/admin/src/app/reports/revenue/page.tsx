'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { RevenueReportDetail } from '@/features/reports-overview/components/RevenueReportDetail';

export default function RevenueDetailPage() {
  return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
        {/* Back Button */}
        <div className="py-4">
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-medium text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة للتقارير
          </Link>
        </div>

        {/* Revenue Detail */}
        <RevenueReportDetail />
      </div>
    </main>
  );
}
