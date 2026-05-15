'use client';

import {
  RegistrationsReportHeader,
  RegistrationsSummaryCards,
  RegistrationsDailyChart,
  RegistrationsMap,
  RegistrationsLiveFeed,
  REGISTRATIONS_SUMMARY,
} from '@/features/reports-registrations';

export default function RegistrationsReportPage() {
  const handleExport = () => {
    alert('تم تصدير التقرير بنجاح');
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 py-8">
        <RegistrationsReportHeader onExport={handleExport} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <RegistrationsSummaryCards summary={REGISTRATIONS_SUMMARY} />
          </div>

          <div className="lg:col-span-8">
            <RegistrationsDailyChart />
          </div>

          <div className="lg:col-span-5">
            <RegistrationsMap />
          </div>

          <div className="lg:col-span-7">
            <RegistrationsLiveFeed />
          </div>
        </div>
      </div>
    </main>
  );
}
