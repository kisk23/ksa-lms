import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  size?: number;
}

export function IconButton({
  icon: Icon,
  onClick,
  className = '',
  ariaLabel,
  size = 20,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-10 h-10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors ${className}`}
    >
      <Icon size={size} />
    </button>
  );
}
