'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/auth';
import { AUTH_QUERY_KEY, useAuth } from '@/features/auth/hooks/useAuth';
import {
  Users,
  ClipboardList,
  Wallet,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

const PARENT_NAV_ITEMS = [
  { href: '/dashboard/parent', label: 'حسابات الأبناء', icon: Users, isBottom: false },
  {
    href: '/dashboard/parent/tasks',
    label: 'متابعة الواجبات',
    icon: ClipboardList,
    isBottom: false,
  },
  { href: '/dashboard/parent/payments', label: 'الرسوم والفواتير', icon: Wallet, isBottom: false },
  { href: '/dashboard/parent/settings', label: 'الإعدادات', icon: Settings, isBottom: true },
] as const;

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
      router.push('/');
    },
  });

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const avatarUrl =
    (user as any)?.avatarUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD-p0N3jiU9Z8OvlXBikfLmVN-gTUWTyQUHWJzlmTpd6AJu50CvfULvKBVabDNIxcqcYb7_98b2JBs_eGmWUqeb9JA6SBZCP2kJVyy1grOOibOIj4z2wRXdUdgScZVoXt8ZdBYd4xpcNxdmGMzP0xuScsGNalCQMmsA2FWj9Xj7EV9qTlE0-D_k7r2UzI4BnKwo6QIhO-8yxoeCfO1ZCXiERMSZOWgEDHpCoqyVS-ouslTlX9crIaUsLmlKI0g9X2PszcxdmkKHAQso';

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const mockNotifications = [
    {
      id: 'n1',
      title: 'تم تأكيد دفع اشتراك الفيزياء',
      desc: 'تم استلام مبلغ 150 ر.س بنجاح لتجديد الدورة',
      time: 'منذ 10 دقائق',
    },
    {
      id: 'n2',
      title: 'تمت إضافة واجب جديد لمادة الحاسب',
      desc: 'واجب الخوارزميات (CS50) موعد التسليم الخميس القادم',
      time: 'منذ ساعتين',
    },
    {
      id: 'n3',
      title: 'تأخر في تسليم واجب الرياضيات',
      desc: 'يرجى متابعة الابن أحمد لتسليم التكليف المطلوبة',
      time: 'منذ يوم واحد',
    },
  ];

  return (
    <div
      className="dashboard-theme min-h-screen bg-background text-on-background relative"
      dir="rtl"
    >
      {/* 1. Header (TopAppBar) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/80 z-50 flex items-center justify-between px-6 font-sans antialiased text-sm font-medium">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            aria-label="القائمة الرئيسية"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/Sullam.svg"
              alt="سُلَّم"
              width={80}
              height={28}
              className="h-7 w-auto object-contain"
            />
            <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
              بوابة ولي الأمر
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mr-auto">
          <button
            className="hover:bg-gray-50 p-2 rounded-full text-gray-500 hover:text-primary transition-all active:scale-95 cursor-pointer"
            title="المساعدة والدعم"
          >
            <HelpCircle size={20} />
          </button>
          <button
            className="hover:bg-gray-50 p-2 rounded-full text-gray-500 hover:text-primary transition-all active:scale-95 cursor-pointer"
            title="الرسائل"
          >
            <MessageSquare size={20} />
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="hover:bg-gray-50 p-2 rounded-full text-gray-500 hover:text-primary transition-all active:scale-95 relative cursor-pointer flex items-center justify-center"
              title="الإشعارات"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200/80 rounded-2xl shadow-xl p-3 z-50 text-right animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-1">
                  <h4 className="font-bold text-on-background text-xs">الإشعارات</h4>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    تحديد الكل كمقروء
                  </button>
                </div>

                <div className="space-y-1">
                  {mockNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer space-y-0.5 border border-transparent hover:border-blue-100"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-on-background">{item.title}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden ms-2 cursor-pointer hover:border-primary transition-colors flex items-center justify-center relative">
            <Image
              src={avatarUrl}
              alt="ولي الأمر"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 2. SideNavBar Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 border-l border-gray-200/80 bg-white shadow-[20px_0_60px_-15px_rgba(22,33,62,0.06)] flex flex-col transition-all duration-300 ease-in-out font-sans text-right text-sm
          ${sidebarOpen ? 'translate-x-0 w-72 lg:top-16 lg:h-[calc(100vh-64px)] z-35' : 'translate-x-full lg:translate-x-0 lg:w-20 lg:top-16 lg:h-[calc(100vh-64px)] z-35'}
          top-0 h-screen z-50 py-8 lg:py-6 gap-2
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute left-4 top-4 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Parent Profile Card */}
        <div className="px-6 mb-4 flex flex-col items-center justify-center text-center transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border-2 border-outline-variant/30 overflow-hidden shadow-sm">
            <Image
              src={avatarUrl}
              alt="ولي الأمر"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`mt-3 transition-all duration-300 ${sidebarOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}
          >
            <h2 className="text-sm font-bold text-on-background">{user?.name || 'أبو أحمد'}</h2>
            <p className="text-[10px] text-secondary font-bold mt-0.5">ولي أمر</p>
          </div>
        </div>

        <div
          className={`border-b border-gray-100 mb-4 mx-6 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        <nav className="flex-grow flex flex-col gap-1.5 px-4 lg:px-2 transition-all duration-300">
          {PARENT_NAV_ITEMS.filter((item) => !item.isBottom).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex rounded-xl cursor-pointer transition-all duration-200 active:scale-98 select-none relative overflow-hidden
                  ${sidebarOpen ? 'flex-row items-center justify-start gap-4 px-4 py-3 w-full' : 'flex-row items-center justify-start gap-4 px-4 py-3 lg:flex-col lg:justify-center lg:items-center lg:gap-1 lg:px-1 lg:py-2.5 lg:w-full'}
                  ${isActive ? 'bg-primary/5 text-primary font-bold' : 'text-text-muted hover:bg-gray-50/80 hover:text-text'}
                `}
              >
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-primary rounded-l-md" />
                )}
                <Icon
                  size={18}
                  className={`${isActive ? 'text-primary' : 'text-gray-400'} shrink-0`}
                />
                <span
                  className={`transition-all duration-300 whitespace-nowrap text-right leading-none ${sidebarOpen ? 'text-xs font-semibold' : 'text-xs font-semibold lg:text-[9px] lg:font-bold lg:text-center'}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <div className="mt-auto flex flex-col gap-1.5 border-t border-gray-100 pt-4">
            {PARENT_NAV_ITEMS.filter((item) => item.isBottom).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex rounded-xl cursor-pointer transition-all duration-200 active:scale-98 select-none relative overflow-hidden
                    ${sidebarOpen ? 'flex-row items-center justify-start gap-4 px-4 py-3 w-full' : 'flex-row items-center justify-start gap-4 px-4 py-3 lg:flex-col lg:justify-center lg:items-center lg:gap-1 lg:px-1 lg:py-2.5 lg:w-full'}
                    ${isActive ? 'bg-primary/5 text-primary font-bold' : 'text-text-muted hover:bg-gray-50/80 hover:text-text'}
                  `}
                >
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-primary rounded-l-md" />
                  )}
                  <Icon
                    size={18}
                    className={`${isActive ? 'text-primary' : 'text-gray-400'} shrink-0`}
                  />
                  <span
                    className={`transition-all duration-300 whitespace-nowrap text-right leading-none ${sidebarOpen ? 'text-xs font-semibold' : 'text-xs font-semibold lg:text-[9px] lg:font-bold lg:text-center'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={() => {
                handleLinkClick();
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isPending}
              className={`flex rounded-xl cursor-pointer transition-all duration-200 active:scale-98 select-none text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50
                ${sidebarOpen ? 'flex-row items-center justify-start gap-4 px-4 py-3 w-full' : 'flex-row items-center justify-start gap-4 px-4 py-3 lg:flex-col lg:justify-center lg:items-center lg:gap-1 lg:px-1 lg:py-2.5 lg:w-full'}
              `}
            >
              <LogOut size={18} className="text-rose-500 shrink-0" />
              <span
                className={`transition-all duration-300 whitespace-nowrap text-right leading-none ${sidebarOpen ? 'text-xs font-bold' : 'text-xs font-bold lg:text-[9px] lg:font-bold lg:text-center'}`}
              >
                {logoutMutation.isPending ? 'خروج...' : 'تسجيل الخروج'}
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* 3. Main content page */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:mr-72' : 'lg:mr-20'}`}
      >
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-full">{children}</div>
      </main>
    </div>
  );
}
