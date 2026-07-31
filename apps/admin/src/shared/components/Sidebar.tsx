'use client';

import { adminAuthService } from '@features/auth';
import { SIDEBAR_NAV } from '@shared/constants/navigation';
import { apiClient } from '@shared/lib/api-client';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    let isMounted = true;

    apiClient
      .get<{ meta: { total: number } }>('/approvals/unseen-count')
      .then((res) => {
        if (isMounted && res?.meta?.total !== undefined) {
          setPendingApprovals(res.meta.total);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch unseen approvals count:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const badges = {
    pendingApprovals: pendingApprovals,
  };

  async function handleLogout() {
    await adminAuthService.logout().catch(() => undefined);
    router.replace('/login');
  }

  return (
    <aside className="hidden md:flex bg-white dark:bg-slate-900 shadow-xl h-screen w-64 border-l border-slate-200 dark:border-slate-800 fixed right-0 top-0 z-40 pt-16 flex-col">
      <div className="p-gutter border-b border-outline-variant/30 text-right">
        <h1 className="text-xl font-bold text-blue-700">سُلَّم التعليمي</h1>
        <p className="text-outline text-caption-ar font-caption-ar mt-xs">نظام إدارة التعلم</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-sm px-base flex flex-col gap-xs mt-sm text-right">
        {SIDEBAR_NAV.filter((item) => !item.hidden).map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? 'flex items-center justify-between gap-sm px-sm py-sm rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-4 border-blue-700 font-bold'
                  : 'flex items-center justify-between gap-sm px-sm py-sm rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:pr-2 transition-all'
              }
            >
              <div className="flex items-center gap-sm">
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
              {badgeCount > 0 && (
                <span className="bg-error text-on-error text-xs font-bold px-2 py-0.5 rounded-full">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-base border-t border-outline-variant/30 mt-auto text-right">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-sm px-sm py-sm rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
