import {
  LayoutDashboard,
  Users,
  BookOpen,
  BadgeCheck,
  CreditCard,
  Undo2,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, href: '/' },
  { label: 'المستخدمين', icon: Users, href: '/users' },
  { label: 'الدورات', icon: BookOpen, href: '/courses' },
  { label: 'الموافقات', icon: BadgeCheck, href: '/approvals' },
  { label: 'المدفوعات', icon: CreditCard, href: '/payments' },
  { label: 'الاستردادات', icon: Undo2, href: '/refunds' },
  { label: 'التقارير', icon: BarChart3, href: '/reports' },
  { label: 'الإعدادات', icon: Settings, href: '/settings' },
];
