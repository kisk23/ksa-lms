'use client';

import { LayoutDashboard, LogIn, Menu, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth, AUTH_QUERY_KEY } from '@/features/auth/hooks/useAuth';
import { Button } from '@lms/ui';
import { authService } from '@/features/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FadeInSection, FadeInItem } from './FadeInSection';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/courses', label: 'الدورات' },
  { href: '/teachers', label: 'المعلمون' },
  { href: '/about', label: 'عن سُلَّم' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [collapse, setCollapse] = useState(false);
  const [collapsActive, setCollapsActive] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
      router.push('/');
    },
  });


  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-border/40 shadow-sm">
      <FadeInSection
        animateImmediate
        className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <FadeInItem className="md:w-1/6 w-1/2">

          <Link href="/" className="flex items-center cursor-pointer ps-2 lg:ps-0">
            <Image src="/Sullam.svg" alt="Sullam Logo" width={80} height={40} priority />
          </Link>
        </FadeInItem>

        {/*collapse button*/}
        <FadeInItem className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={collapse}
            className={`md:hidden p-2 rounded-lg shadow-md transition ${
              collapsActive ? 'bg-surface text-text' : 'text-primary hover:bg-surface-hover/50'
            }`}
            onClick={() => {
              setCollapse(!collapse);
              setCollapsActive(!collapsActive);
            }}
          >
            <Menu size={20} />
          </button>
        </FadeInItem>

        <FadeInItem
          className={`${
            collapse ? 'block' : 'hidden'
          } w-full md:flex md:w-5/6 px-4 flex flex-col md:flex-row md:justify-between`}
        >
          <div className="w-full md:w-4/6 flex md:justify-center ">
            <ul className="font-medium flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4 md:mt-0 gap-1 md:gap-0">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block font-semibold text-lg py-2 ${
                        active
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-text-muted hover:text-primary/80'
                      } transition`}
                      onClick={() => setCollapse(false)}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="w-full md:w-2/6 flex items-center md:justify-end lg:gap-4 gap-2 mt-4 md:mt-0">
            {isLoading ? (
              <div className="h-10 w-28 rounded-lg bg-surface animate-pulse ms-auto" />
            ) : isAuthenticated ? (
              <>
                <Button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="bg-danger font-semibold text-sm py-2.5 px-4 hover:bg-danger/80 cursor-pointer transition-all duration-200 active:scale-95 text-text shadow-none disabled:opacity-70"
                >
                  {logoutMutation.isPending ? 'جاري...' : 'تسجيل الخروج'}
                </Button>
                <Link
                  href="/dashboard"
                  className=" flex items-center gap-2 font-semibold text-sm bg-primary text-text px-4 py-2.5 rounded-lg hover:bg-primary-hover transition-all duration-200 active:scale-95 shadow-[0_4px_14px_0_rgba(36,70,184,0.25)]"
                  title={user?.name ?? 'لوحة التحكم'}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                  <span className="sm:hidden">حسابي</span>
                </Link>
              </>
            ) : (
              <div className="flex flex-row-reverse gap-3 ms-auto">
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 font-semibold text-sm bg-primary text-text hover:bg-primary-hover transition-all duration-200 active:scale-95 px-4 py-2 rounded-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>تسجيل جديد</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 font-semibold text-sm text-primary hover:bg-primary/10 transition-all duration-200 active:scale-95 px-4 py-2 rounded-lg border-2 border-primary"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              </div>
            )}
          </div>
        </FadeInItem>
      </FadeInSection>
    </nav>
  );
}
