'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = 'عنصر',
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const visiblePages = [1, 2, 3].filter((p) => p <= totalPages);
  const showEllipsis = totalPages > 4;

  const pageBtnBase =
    'w-8 h-8 flex items-center justify-center rounded font-medium text-sm transition-colors';

  return (
    <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50">
      <span className="text-sm text-on-surface-variant font-caption-ar">
        عرض {start} إلى {end} من أصل {totalItems} {itemLabel}
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={`${pageBtnBase} ${
              currentPage === page
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface hover:bg-surface-variant'
            }`}
          >
            {page}
          </button>
        ))}

        {showEllipsis && (
          <>
            <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
              ...
            </span>
            <button
              onClick={() => onPageChange?.(totalPages)}
              className={`${pageBtnBase} text-on-surface hover:bg-surface-variant`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
}
