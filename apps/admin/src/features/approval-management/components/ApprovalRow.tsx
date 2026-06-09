import { Avatar } from '@shared/components/ui/Avatar';
import { Eye, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { ApprovalStatusPill } from './ApprovalStatusPill';
import { RequestTypeBadge } from './RequestTypeBadge';
import type { ApprovalListItem } from '../types';

type ApprovalRowProps = {
  approval: ApprovalListItem;
  zebra?: boolean;
};

export function ApprovalRow({ approval, zebra = false }: ApprovalRowProps) {
  const isPending = approval.status === 'PENDING_REVIEW';

  return (
    <tr className={`${zebra ? 'bg-slate-50/50' : ''} hover:bg-slate-50 transition-colors group`}>
      <td className="py-4 px-6">
        <RequestTypeBadge type={approval.requestType} />
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <Avatar fallback={approval.teacherInitials} size="sm" />
          <span className="text-on-surface font-medium">{approval.teacherName}</span>
        </div>
      </td>

      <td className="py-4 px-6 text-on-surface">{approval.courseOrLessonName}</td>

      <td className="py-4 px-6 text-on-surface-variant text-sm">{approval.requestDate}</td>

      <td className="py-4 px-6">
        <ApprovalStatusPill status={approval.status} />
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionLink
            href={`/approvals/${approval.id}`}
            icon={Eye}
            title="عرض التفاصيل"
            hoverColor="hover:text-primary-container hover:bg-blue-50"
          />

          {isPending && (
            <>
              <ActionButton
                icon={CheckCircle2}
                title="موافقة سريعة"
                hoverColor="hover:text-emerald-600 hover:bg-emerald-50"
              />
              <ActionButton
                icon={XCircle}
                title="رفض سريع"
                hoverColor="hover:text-red-600 hover:bg-red-50"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function ActionLink({
  href,
  icon: Icon,
  title,
  hoverColor,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  hoverColor: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className={`p-1.5 text-slate-400 rounded-lg transition-colors ${hoverColor}`}
    >
      <Icon size={20} />
    </Link>
  );
}

function ActionButton({
  icon: Icon,
  title,
  hoverColor,
}: {
  icon: LucideIcon;
  title: string;
  hoverColor: string;
}) {
  return (
    <button
      title={title}
      className={`p-1.5 text-slate-400 rounded-lg transition-colors ${hoverColor}`}
    >
      <Icon size={20} />
    </button>
  );
}
