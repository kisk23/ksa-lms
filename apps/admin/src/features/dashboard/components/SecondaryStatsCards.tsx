'use client';

import { apiClient } from '@shared/lib/api-client';
import { BookOpenText, PlayCircle, Clock, Wallet, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { QuickStatCard, type QuickStatCardProps } from './QuickStatCard';

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  monthlyRevenue: number;
}

export function SecondaryStatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('حدث خطأ أثناء تحميل البيانات');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[142px] w-full bg-surface-container rounded-card border border-outline-variant/10 mb-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-card bg-error-container text-on-error-container rounded-card mb-xl w-full text-center">
        {error}
      </div>
    );
  }

  const statsData: QuickStatCardProps[] = [
    {
      icon: BookOpenText,
      iconColor: 'text-primary',
      iconBg: 'bg-primary-container/10',
      title: 'إجمالي الدورات',
      value: stats ? stats.totalCourses.toLocaleString('ar-EG') : '0',
    },
    {
      icon: PlayCircle,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary-container/20',
      title: 'الدورات النشطة',
      value: stats ? stats.activeCourses.toLocaleString('ar-EG') : '0',
    },
    {
      icon: Clock,
      iconColor: 'text-on-surface-variant',
      iconBg: 'bg-surface-variant',
      title: 'قيد المراجعة',
      value: stats ? stats.draftCourses.toLocaleString('ar-EG') : '0',
    },
    {
      icon: Wallet,
      iconColor: 'text-tertiary',
      iconBg: 'bg-tertiary-container/10',
      title: 'الإيرادات الشهرية',
      value: (
        <>
          {stats ? stats.monthlyRevenue.toLocaleString('ar-EG') : '0'}{' '}
          <span className="text-sm text-outline">ر.س</span>
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
      {statsData.map((item, idx) => (
        <QuickStatCard key={idx} {...item} />
      ))}
    </div>
  );
}
