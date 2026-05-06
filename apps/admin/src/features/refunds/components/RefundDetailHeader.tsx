import { ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import type { RefundStatus } from '../types';

interface RefundDetailHeaderProps {
  requestNumber: string;
  status: RefundStatus;
}

const STATUS_CONFIG: Record<RefundStatus, { label: string; className: string }> = {
  pending: {
    label: 'قيد المراجعة',
    className: 'bg-surface-container-high text-primary',
  },
  approved: {
    label: 'مقبول',
    className: 'bg-secondary/10 text-secondary',
  },
  rejected: {
    label: 'مرفوض',
    className: 'bg-error/10 text-error',
  },
};

export function RefundDetailHeader({ requestNumber, status }: RefundDetailHeaderProps) {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <>
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-base mb-lg text-outline font-caption-ar"
      >
        <Link
          href="/refunds"
          className="hover:text-primary transition-colors flex items-center gap-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الطلبات</span>
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <Link href="/refunds" className="hover:text-primary transition-colors">
          طلبات الاسترجاع
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-on-surface font-semibold">تفاصيل الطلب #{requestNumber}</span>
      </nav>

      {/* Header */}
      <header className="flex justify-between items-end mb-lg border-b border-surface-container-highest pb-md">
        <div>
          <h1 className="font-h1-ar text-h1-ar text-on-surface mb-xs">تفاصيل طلب الاسترجاع</h1>
          <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">
            معالجة طلب استرجاع للطالب بناءً على سياسة المنصة.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <span
            className={`px-sm py-xs rounded-full font-label-en text-label-en flex items-center gap-xs ${statusConfig.className}`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {statusConfig.label}
          </span>
        </div>
      </header>
    </>
  );
}
