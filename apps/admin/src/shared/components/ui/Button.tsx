import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger-outline';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-container text-on-primary hover:bg-primary shadow-sm',
  secondary: 'bg-surface-container text-on-surface hover:bg-surface-variant',
  ghost: 'text-primary hover:text-primary/80 hover:bg-primary-container/10',
  success: 'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm',
  'danger-outline': 'border border-error text-error hover:bg-error/5 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-body-md-ar font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full justify-center' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
