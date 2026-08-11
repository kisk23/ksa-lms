type StatusVariant = 'success' | 'error' | 'warning' | 'neutral' | 'info';

interface StatusDotProps {
  variant: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-secondary',
  error: 'bg-error',
  warning: 'bg-yellow-500',
  neutral: 'bg-outline',
  info: 'bg-primary',
};

export function StatusDot({ variant, className = '' }: StatusDotProps) {
  return <span className={`w-2 h-2 rounded-full ${variantStyles[variant]} ${className}`} />;
}
