import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type BackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export function BackLink({ href, label, className = '' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-outline hover:text-primary transition-colors mb-sm ${className}`}
    >
      <ArrowRight size={20} />
      <span className="font-body-md-ar text-body-md-ar">{label}</span>
    </Link>
  );
}
