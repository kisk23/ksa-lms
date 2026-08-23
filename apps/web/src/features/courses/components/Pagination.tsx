'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  /** Build a compact page list with ellipsis */
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('ellipsis-start');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('ellipsis-end');
    pages.push(totalPages);
  }

  const btnBase =
    'w-9 h-9 flex items-center justify-center rounded-radius-sm text-sm font-medium transition-colors';

  return (
    <nav
      aria-label="pagination"
      className="flex justify-center items-center gap-1.5 mt-10 pt-6 border-t border-border/50"
      dir="rtl"
    >
      {/* Previous (RTL: right side) */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="الصفحة السابقة"
        className={`${btnBase} border border-border text-text-muted hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ‹
      </button>

      {pages.map((p) => {
        if (p === 'ellipsis-start' || p === 'ellipsis-end') {
          return (
            <span key={p} className="text-text-muted px-1 select-none">
              …
            </span>
          );
        }
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btnBase} ${
              p === page
                ? 'bg-primary text-white shadow-sm'
                : 'border border-border  hover:text-text hover:bg-surface-hover'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next (RTL: left side) */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="الصفحة التالية"
        className={`${btnBase} border border-border text-text-muted hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ›
      </button>
    </nav>
  );
}
