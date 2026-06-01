'use client';

import { apiClient } from '@shared/lib/api-client';
import { Users, GraduationCap, User, Users2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { OverviewCard, type OverviewCardProps } from './OverviewCard';

interface DashboardStats {
  totalUsers: number;
  activeStudents: number;
  teachers: number;
  parents: number;
}

export function OverviewCards() {
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
      <div className="flex justify-center items-center h-[142px] w-full bg-surface-container rounded-card border border-outline-variant/10 mb-gutter">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-card bg-error-container text-on-error-container rounded-card mb-gutter w-full text-center">
        {error}
      </div>
    );
  }

  const overviewData: OverviewCardProps[] = [
    {
      icon: Users,
      iconColor: 'text-primary',
      glowColor: 'bg-primary-container',
      badge: '+12%',
      badgeVariant: 'success',
      title: 'إجمالي المستخدمين',
      value: stats ? stats.totalUsers.toLocaleString('ar-EG') : '0',
    },
    {
      icon: GraduationCap,
      iconColor: 'text-tertiary',
      glowColor: 'bg-tertiary-container',
      badge: '+8%',
      badgeVariant: 'success',
      title: 'الطلاب النشطين',
      value: stats ? stats.activeStudents.toLocaleString('ar-EG') : '0',
    },
    {
      icon: User,
      iconColor: 'text-outline',
      glowColor: 'bg-error-container',
      badge: '+2%',
      badgeVariant: 'neutral',
      title: 'المعلمين',
      value: stats ? stats.teachers.toLocaleString('ar-EG') : '0',
    },
    {
      icon: Users2,
      iconColor: 'text-secondary',
      glowColor: 'bg-secondary-container',
      badge: '+15%',
      badgeVariant: 'success',
      title: 'أولياء الأمور',
      value: stats ? stats.parents.toLocaleString('ar-EG') : '0',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
      {overviewData.map((item) => (
        <OverviewCard key={item.title} {...item} />
      ))}
    </div>
  );
}
