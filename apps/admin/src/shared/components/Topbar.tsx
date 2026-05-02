'use client';

import { IconButton } from '@shared/components/ui/IconButton';
import { Bell, Settings, Search } from 'lucide-react';
import Image from 'next/image';

export function Topbar() {
  return (
    <nav className="hidden md:flex bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 right-0 z-50 items-center justify-between px-6 h-16 w-full flex-row-reverse">
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-sm">
          <IconButton icon={Bell} ariaLabel="Notifications" />
          <IconButton icon={Settings} ariaLabel="Settings" />
          <Image
            alt="صورة الملف الشخصي للمستخدم"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAVkDqwaChOl5mabzUTKsdWkNgNf9EFdhKeJV1duDz5djVDxYVMwk69NLJlEEhfZB1dfLUIPSQVz1DOl4mOrQL_HSlo51emZWazs3k2azn-qw6GuvA7tm2jWS8kHjhuagVVXxFtH1CvU-lUXVBSRMKDZIb9cy6A0UnwSbjEPu5CCji9fkAEEIKCIQh9cnfnQJ648vBgUTn0SOivr3Sf4_GaK3UoNaDIryKIkLH76tB2aHDqfUOY1jRjRejpDGQBqt2V7rR8TKNyEUh"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
      </div>

      <div className="flex-1 max-w-2xl px-lg">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="البحث في لوحة التحكم..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md-ar font-body-md-ar transition-all placeholder:text-outline"
          />
        </div>
      </div>

      <div className="flex items-center gap-sm shrink-0">
        <span className="text-2xl font-black text-blue-700 dark:text-blue-500">سُلَّم</span>
      </div>
    </nav>
  );
}
