import type { ReactNode } from 'react';

type TagVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral';

type TagProps = {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
};

const variantStyles: Record<TagVariant, string> = {
  primary: 'bg-primary-container/10 text-primary',
  secondary: 'bg-secondary-container/20 text-on-secondary-container',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
  neutral: 'bg-outline-variant/30 text-on-surface-variant',
};

export function Tag({ children, variant = 'neutral', className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
