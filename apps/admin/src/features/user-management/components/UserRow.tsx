import { Avatar } from '@shared/components/ui/Avatar';
import { Tag } from '@shared/components/ui/Tag';
import {
  CheckCircle2,
  Clock,
  Ban,
  Eye,
  Pencil,
  Check,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import type { User, UserRole, UserStatus } from '../types';

type UserRowProps = {
  user: User;
  zebra?: boolean;
};

// Role → Tag config
const roleConfig: Record<
  UserRole,
  { label: string; variant: 'primary' | 'secondary' | 'default' }
> = {
  student: { label: 'طالب', variant: 'secondary' },
  teacher: { label: 'مدرس', variant: 'primary' },
  parent: { label: 'ولي أمر', variant: 'default' },
};

// Status → display config
const statusConfig: Record<UserStatus, { label: string; icon: LucideIcon; color: string }> = {
  active: {
    label: 'نشط',
    icon: CheckCircle2,
    color: 'text-secondary',
  },
  pending: {
    label: 'معلق',
    icon: Clock,
    color: 'text-yellow-600',
  },
  blocked: {
    label: 'محظور',
    icon: Ban,
    color: 'text-error',
  },
};

export function UserRow({ user, zebra = false }: UserRowProps) {
  const role = roleConfig[user.role];
  const status = statusConfig[user.status];
  const StatusIcon = status.icon;
  const isBlocked = user.status === 'blocked';
  const isPending = user.status === 'pending';

  const fallbackInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <tr
      className={`${
        zebra ? 'bg-surface-container-lowest/30' : ''
      } hover:bg-surface-container-lowest/50 transition-colors group`}
    >
      <td className="py-3 px-6">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatarUrl} alt={user.name} fallback={fallbackInitials} size="md" />
          <span className={`font-medium text-on-background ${isBlocked ? 'opacity-50' : ''}`}>
            {user.name}
          </span>
        </div>
      </td>

      <td className={`py-3 px-6 text-on-surface-variant ${isBlocked ? 'opacity-50' : ''}`}>
        {user.email}
      </td>

      <td className={`py-3 px-6 ${isBlocked ? 'opacity-50' : ''}`}>
        <Tag label={role.label} variant={role.variant} />
      </td>

      <td className={`py-3 px-6 text-on-surface-variant text-sm ${isBlocked ? 'opacity-50' : ''}`}>
        {user.registeredAt}
      </td>

      <td className="py-3 px-6">
        <div className={`flex items-center gap-1.5 ${status.color}`}>
          <StatusIcon size={14} />
          <span className="text-sm">{status.label}</span>
        </div>
      </td>

      <td className="py-3 px-6 text-left">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionButton icon={Eye} title="عرض" />
          <ActionButton icon={Pencil} title="تعديل" />

          {isPending && (
            <ActionButton
              icon={Check}
              title="موافقة"
              hoverColor="hover:text-secondary hover:bg-secondary/10"
            />
          )}

          {!isPending && !isBlocked && (
            <ActionButton icon={Ban} title="حظر" hoverColor="hover:text-error hover:bg-error/10" />
          )}

          {isBlocked && (
            <ActionButton
              icon={Trash2}
              title="حذف"
              className="text-error"
              hoverColor="hover:bg-error/10"
            />
          )}
        </div>
      </td>
    </tr>
  );
}

// Local helper — small enough to keep inline
function ActionButton({
  icon: Icon,
  title,
  hoverColor = 'hover:text-primary hover:bg-primary/10',
  className = 'text-on-surface-variant',
}: {
  icon: LucideIcon;
  title: string;
  hoverColor?: string;
  className?: string;
}) {
  return (
    <button
      title={title}
      className={`p-1.5 rounded-md transition-colors ${className} ${hoverColor}`}
    >
      <Icon size={18} />
    </button>
  );
}
