import type { LucideIcon } from 'lucide-react';

export type DropdownItemProps = {
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
  hoverClass?: string;
};

export function DropdownItem({
  icon: Icon,
  label,
  onClick,
  hoverClass = 'hover:bg-surface-container hover:text-primary',
  disabled = false,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors w-full text-right font-medium text-on-surface-variant cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${hoverClass}`}
    >
      <Icon size={16} className="opacity-80" />
      <span>{label}</span>
    </button>
  );
}
