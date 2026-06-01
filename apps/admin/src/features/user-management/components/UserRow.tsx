import { Avatar } from '@shared/components/ui/Avatar';
import { Tag } from '@shared/components/ui/Tag';
import { CheckCircle2, Clock, Ban, Eye, Check, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { forwardRef } from 'react';

import { UserRole, type User, type UserStatus } from '../types';

type UserRowProps = {
  user: User;
  zebra?: boolean;
  onBanUser?: (userId: string) => void;
  onApproveUser?: (userId: string) => void;
};

const roleConfig: Record<string, { label: string; variant: 'primary' | 'secondary' | 'default' }> =
  {
    [UserRole.STUDENT]: { label: 'طالب', variant: 'secondary' },
    [UserRole.TEACHER]: { label: 'مدرس', variant: 'primary' },
    [UserRole.PARENT]: { label: 'ولي أمر', variant: 'default' },
    [UserRole.ASSISTANT_ADMIN]: { label: 'مشرف', variant: 'primary' },
    [UserRole.SUPER_ADMIN]: { label: 'مشرف عام', variant: 'primary' },
    // Legacy mappings
    admin: { label: 'مشرف', variant: 'primary' },
    ADMIN: { label: 'مشرف', variant: 'primary' },
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

export const UserRow = forwardRef<HTMLTableRowElement, UserRowProps>(
  ({ user, zebra = false, onBanUser, onApproveUser }, ref) => {
    const normalizedRole = user.role?.toUpperCase() as UserRole;
    const role = roleConfig[user.role] ||
      roleConfig[normalizedRole] || { label: user.role || 'غير معروف', variant: 'default' };
    const status = statusConfig[user.status] || {
      label: user.status,
      icon: Clock,
      color: 'text-outline',
    };
    const StatusIcon = status.icon;
    const isBlocked = user.status === 'blocked';
    const isPending = user.status === 'pending';

    const fallbackInitials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

    return (
      <motion.tr
        ref={ref}
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
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

        <td
          className={`py-3 px-6 text-on-surface-variant text-sm ${isBlocked ? 'opacity-50' : ''}`}
        >
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

            {isPending && (
              <ActionButton
                icon={Check}
                title="موافقة"
                hoverColor="hover:text-secondary hover:bg-secondary/10"
                onClick={() => onApproveUser?.(user.id)}
              />
            )}

            {!isPending && !isBlocked && (
              <ActionButton
                icon={Ban}
                title="حظر"
                hoverColor="hover:text-error hover:bg-error/10"
                onClick={() => onBanUser?.(user.id)}
              />
            )}

            {isBlocked && (
              <ActionButton
                icon={CheckCircle2}
                title="إلغاء الحظر"
                className="text-secondary"
                hoverColor="hover:bg-secondary/10"
                onClick={() => onApproveUser?.(user.id)}
              />
            )}
          </div>
        </td>
      </motion.tr>
    );
  },
);

UserRow.displayName = 'UserRow';

// Local helper — small enough to keep inline
function ActionButton({
  icon: Icon,
  title,
  hoverColor = 'hover:text-primary hover:bg-primary/10',
  className = 'text-on-surface-variant',
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  hoverColor?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${className} ${hoverColor}`}
    >
      <Icon size={18} />
    </button>
  );
}
