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
  badgeKey?: 'pendingApprovals'; // optional dynamic badge
  hidden?: boolean; // set true to hide from sidebar without deleting
};

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, href: '/' },
  { label: 'إدارة المستخدمين', icon: Users, href: '/users' },
  { label: 'إدارة المعلمين', icon: Users, href: '/teachers' },
  { label: 'إدارة الكورسات', icon: BookOpen, href: '/courses' },
  {
    label: 'طلبات الموافقة',
    icon: BadgeCheck,
    href: '/approvals',
    badgeKey: 'pendingApprovals',
  },
  { label: 'إدارة المدفوعات', icon: CreditCard, href: '/payments' },
  { label: 'إدارة الاسترجاعات', icon: Undo2, href: '/refunds' },
  { label: 'التقارير', icon: BarChart3, href: '/reports' },
  { label: 'إعدادات المنصة', icon: Settings, href: '/settings', hidden: true },
];
