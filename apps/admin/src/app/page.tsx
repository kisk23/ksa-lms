import {
  DashboardHeader,
  OverviewCards,
  SecondaryStatsCards,
  RevenueChart,
  EnrollmentsChart,
  RecentActivity,
} from '@features/dashboard';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <OverviewCards />
      <SecondaryStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
        <RevenueChart />
        <EnrollmentsChart />
      </div>

      <RecentActivity />
    </>
  );
}
