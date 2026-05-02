'use client';

import { SIDEBAR_NAV } from '@shared/constants/navigation';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex bg-white dark:bg-slate-900 shadow-xl h-screen w-64 border-l border-slate-200 dark:border-slate-800 fixed right-0 top-0 z-40 pt-16 flex-col">
      <div className="p-gutter border-b border-outline-variant/30 text-right">
        <h1 className="text-xl font-bold text-blue-700">سُلَّم التعليمي</h1>
        <p className="text-outline text-caption-ar font-caption-ar mt-xs">نظام إدارة التعلم</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-sm px-base flex flex-col gap-xs mt-sm text-right">
        {SIDEBAR_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? 'flex items-center gap-sm px-sm py-sm rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-4 border-blue-700 font-bold'
                  : 'flex items-center gap-sm px-sm py-sm rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:pr-2 transition-all'
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-base border-t border-outline-variant/30 mt-auto text-right">
        <a
          href="#"
          className="flex items-center gap-sm px-sm py-sm rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </a>
      </div>
    </aside>
  );
}
