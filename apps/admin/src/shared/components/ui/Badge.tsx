import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'neutral' | 'error' | 'info' | 'warning';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'text-secondary bg-secondary-container/20',
  neutral: 'text-outline bg-surface-variant',
  error: 'text-error bg-error-container/50',
  info: 'text-primary bg-primary-container/10',
  warning: 'text-tertiary bg-tertiary-container/10',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`font-bold text-sm px-2 py-1 rounded ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
