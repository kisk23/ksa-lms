import { Star } from 'lucide-react';

interface RatingProps {
  value: number | null;
  className?: string;
}

export function Rating({ value, className = '' }: RatingProps) {
  if (value === null || value === undefined) {
    return (
      <div className={`flex items-center text-on-surface-variant ${className}`}>
        <span className="font-bold">-</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center text-secondary ${className}`}>
      <Star size={14} fill="currentColor" />
      <span className="mr-1 font-bold">{value.toFixed(1)}</span>
    </div>
  );
}
