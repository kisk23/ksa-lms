'use client';
/* eslint-disable @next/next/no-img-element */

import { Bell, MessageSquare, HelpCircle, Menu, User } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface TopAppBarProps {
  onToggleSidebar: () => void;
}

export function TopAppBar({ onToggleSidebar }: TopAppBarProps) {
  const { user } = useAuth();

  // Extract avatar URL if it exists, otherwise use placeholder or design URL
  const avatarUrl =
    (user as any)?.avatarUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD-p0N3jiU9Z8OvlXBikfLmVN-gTUWTyQUHWJzlmTpd6AJu50CvfULvKBVabDNIxcqcYb7_98b2JBs_eGmWUqeb9JA6SBZCP2kJVyy1grOOibOIj4z2wRXdUdgScZVoXt8ZdBYd4xpcNxdmGMzP0xuScsGNalCQMmsA2FWj9Xj7EV9qTlE0-D_k7r2UzI4BnKwo6QIhO-8yxoeCfO1ZCXiERMSZOWgEDHpCoqyVS-ouslTlX9crIaUsLmlKI0g9X2PszcxdmkKHAQso';

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/80 z-50 flex items-center justify-between px-6 font-sans antialiased text-sm font-medium"
      dir="rtl"
    >
      {/* Brand logo & Hamburger menu toggler */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="القائمة الرئيسية"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/Sullam.svg" alt="سُلَّم" className="h-7 w-auto object-contain" />
        </div>
      </div>

      {/* Trailing Icons on the Right (visually right in RTL, aligns right/flex-end) */}
      <div className="flex items-center gap-3 mr-auto">
        {/* Help button */}
        <button
          className="hover:bg-gray-50 p-2 rounded-full text-gray-500 hover:text-primary transition-all active:scale-95"
          title="المساعدة والدعم"
        >
          <HelpCircle size={20} />
        </button>

        {/* Chat button */}
        <button
          className="hover:bg-gray-50 p-2 rounded-full text-gray-500 hover:text-primary transition-all active:scale-95"
          title="الرسائل"
        >
          <MessageSquare size={20} />
        </button>

        {/* Notification button with badge */}
        <button
          className="hover:bg-gray-50 p-2 rounded-full text-gray-500 hover:text-primary transition-all active:scale-95 relative"
          title="الإشعارات"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Profile Avatar */}
        <div
          className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden ms-2 cursor-pointer hover:border-primary transition-colors flex items-center justify-center relative"
          title={user?.name || 'الملف الشخصي'}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="صورة الطالب الشخصية" className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
        </div>
      </div>
    </header>
  );
}
