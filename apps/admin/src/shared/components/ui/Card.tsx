import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-card-soft border border-outline-variant/20 p-md ${className}`}
    >
      {children}
    </div>
  );
}
