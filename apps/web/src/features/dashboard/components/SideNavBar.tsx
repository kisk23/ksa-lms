'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/auth';
import { AUTH_QUERY_KEY } from '@/features/auth/hooks/useAuth';
import {
  GraduationCap,
  Video,
  ClipboardList,
  FileQuestion,
  Wallet,
  Settings,
  X,
  LogOut,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'دروسي', icon: GraduationCap, isBottom: false },
  { href: '/dashboard/live', label: 'جلسات مباشرة', icon: Video, isBottom: false },
  { href: '/dashboard/tasks', label: 'المهام', icon: ClipboardList, isBottom: false },
  { href: '/dashboard/calendar', label: 'الجدول', icon: Calendar, isBottom: false },
  { href: '/dashboard/quizzes', label: 'الاختبارات', icon: FileQuestion, isBottom: false },
  { href: '/dashboard/achievements', label: 'الإنجازات', icon: Award, isBottom: false },
  { href: '/dashboard/reports', label: 'التقارير', icon: BarChart3, isBottom: false },
  { href: '/dashboard/wallet', label: 'المحفظة', icon: Wallet, isBottom: false },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings, isBottom: true },
] as const;

export function SideNavBar({ isOpen = true, onClose }: SideNavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
      router.push('/');
    },
  });

  // Only close the drawer overlay when clicking on a link if we are on mobile
  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay - hidden on desktop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed right-0 border-l border-gray-200/80 bg-white shadow-[20px_0_60px_-15px_rgba(22,33,62,0.06)] flex flex-col transition-all duration-300 ease-in-out font-sans text-right text-sm
          ${isOpen ? 'translate-x-0 w-72 lg:top-16 lg:h-[calc(100vh-64px)] z-35' : 'translate-x-full lg:translate-x-0 lg:w-20 lg:top-16 lg:h-[calc(100vh-64px)] z-35'}
          top-0 h-screen z-50 py-8 lg:py-6 gap-2
        `}
        dir="rtl"
      >
        {/* Close button for Mobile drawer only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute left-4 top-4 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer z-10"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        )}

        {/* User Profile Header matching request screenshot */}
        <div className="px-6 mb-4 flex flex-col items-center justify-center text-center transition-all duration-300">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border-2 border-outline-variant/30 overflow-hidden shadow-sm">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6zwZpsWh_pqqtUFNMCNi4C0j9Ch28_8xo6NxqWSg6ykUFAIaTaHYkHxuRaEnSCpl7LCZomIgcK4GYRhb29zY_TRkBFL2oEp4wygxaUQ56DQyXzpO9M2sdcJGhn2CQPgen-GcRnrl014NQRKmGuBjU7UnPRc1LBEMvqF8s_FFo7b-NOzlKOTADf956Jv9I6wnGzGi0gF6D7ZWWQg5ZltRLKAzOgIZwcr65FR004D-xWruKEhG01w"
                alt="أحمد علي"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div
            className={`mt-3 transition-all duration-300 ${isOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}
          >
            <h2 className="text-sm font-bold text-on-background">أحمد علي</h2>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">المسار الثانوي</p>
          </div>
        </div>

        {/* Divider matching request screenshot */}
        <div
          className={`border-b border-gray-100 mb-4 mx-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Navigation list */}
        <nav className="flex-grow flex flex-col gap-1.5 px-4 lg:px-2 transition-all duration-300">
          {NAV_ITEMS.filter((item) => !item.isBottom).map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard' || pathname?.startsWith('/dashboard/courses')
                : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex rounded-xl cursor-pointer transition-all duration-200 active:scale-98 select-none relative overflow-hidden
                  ${
                    isOpen
                      ? 'flex-row items-center justify-start gap-4 px-4 py-3 w-full'
                      : 'flex-row items-center justify-start gap-4 px-4 py-3 lg:flex-col lg:justify-center lg:items-center lg:gap-1 lg:px-1 lg:py-2.5 lg:w-full'
                  }
                  ${
                    isActive
                      ? 'bg-primary/5 text-primary font-bold'
                      : 'text-text-muted hover:bg-gray-50/80 hover:text-text'
                  }
                `}
              >
                {/* Active blue indicator bar on right edge matching screenshot */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-primary rounded-l-md" />
                )}

                <Icon
                  size={18}
                  className={`${isActive ? 'text-primary' : 'text-gray-400'} shrink-0`}
                />

                <span
                  className={`transition-all duration-300 whitespace-nowrap text-right leading-none
                    ${
                      isOpen
                        ? 'text-xs font-semibold'
                        : 'text-xs font-semibold lg:text-[9px] lg:font-bold lg:text-center'
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Bottom links (e.g. Settings, Logout) */}
          <div className="mt-auto flex flex-col gap-1.5 border-t border-gray-100 pt-4">
            {NAV_ITEMS.filter((item) => item.isBottom).map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex rounded-xl cursor-pointer transition-all duration-200 active:scale-98 select-none relative overflow-hidden
                    ${
                      isOpen
                        ? 'flex-row items-center justify-start gap-4 px-4 py-3 w-full'
                        : 'flex-row items-center justify-start gap-4 px-4 py-3 lg:flex-col lg:justify-center lg:items-center lg:gap-1 lg:px-1 lg:py-2.5 lg:w-full'
                    }
                    ${
                      isActive
                        ? 'bg-primary/5 text-primary font-bold'
                        : 'text-text-muted hover:bg-gray-50/80 hover:text-text'
                    }
                  `}
                >
                  {/* Active blue indicator bar on right edge */}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-primary rounded-l-md" />
                  )}

                  <Icon
                    size={18}
                    className={`${isActive ? 'text-primary' : 'text-gray-400'} shrink-0`}
                  />

                  <span
                    className={`transition-all duration-300 whitespace-nowrap text-right leading-none
                      ${
                        isOpen
                          ? 'text-xs font-semibold'
                          : 'text-xs font-semibold lg:text-[9px] lg:font-bold lg:text-center'
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Sign Out Button */}
            <button
              onClick={() => {
                handleLinkClick();
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isPending}
              className={`flex rounded-xl cursor-pointer transition-all duration-200 active:scale-98 select-none text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50
                ${
                  isOpen
                    ? 'flex-row items-center justify-start gap-4 px-4 py-3 w-full'
                    : 'flex-row items-center justify-start gap-4 px-4 py-3 lg:flex-col lg:justify-center lg:items-center lg:gap-1 lg:px-1 lg:py-2.5 lg:w-full'
                }
              `}
            >
              <LogOut size={18} className="text-rose-500 shrink-0" />
              <span
                className={`transition-all duration-300 whitespace-nowrap text-right leading-none mr-4 lg:mr-0
                  ${
                    isOpen
                      ? 'text-xs font-bold'
                      : 'text-xs font-bold lg:text-[9px] lg:font-bold lg:text-center'
                  }
                `}
              >
                {logoutMutation.isPending ? 'خروج...' : 'تسجيل الخروج'}
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
