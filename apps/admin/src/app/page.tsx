// apps/admin/src/app/page.tsx
import {
  DashboardHeader,
  OverviewCards,
  SecondaryStatsCards,
  RevenueChart,
  EnrollmentsChart,
  RecentActivity,
} from '@features/dashboard';

export default async function DashboardPage() {
  // Fetch user count from API
  let userCount = 0;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/count`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    userCount = data.count || 0;

    // Debug logging
    // eslint-disable-next-line no-console
    console.log('User count from API:', data);
    // eslint-disable-next-line no-console
    console.log('Parsed user count:', userCount);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch user count:', error);
  }

  return (
    <>
      <DashboardHeader />
      <OverviewCards userCount={userCount} />
      <SecondaryStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
        <RevenueChart />
        <EnrollmentsChart />
      </div>

      <RecentActivity />
    </>
  );
}
