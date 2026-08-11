'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = 'عنصر',
  onPageChange,
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  let visiblePages: number[] = [];
  let showStartEllipsis = false;
  let showEndEllipsis = false;

  if (totalPages <= 5) {
    visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      visiblePages = [1, 2, 3, 4];
      showEndEllipsis = true;
    } else if (currentPage >= totalPages - 2) {
      showStartEllipsis = true;
      visiblePages = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      showStartEllipsis = true;
      showEndEllipsis = true;
      visiblePages = [currentPage - 1, currentPage, currentPage + 1];
    }
  }

  const pageBtnBase =
    'w-8 h-8 flex items-center justify-center rounded font-medium text-sm transition-colors';

  return (
    <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50">
      <span className="text-sm text-on-surface-variant font-caption-ar">
        عرض {start} إلى {end} من أصل {totalItems} {itemLabel}
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1 || totalPages === 0}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>

        {showStartEllipsis && (
          <>
            <button
              onClick={() => onPageChange?.(1)}
              className={`${pageBtnBase} text-on-surface hover:bg-surface-variant`}
            >
              1
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
              ...
            </span>
          </>
        )}

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

        {showEndEllipsis && (
          <>
            <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
              ...
            </span>
            <button
              onClick={() => onPageChange?.(totalPages)}
              className={`${pageBtnBase} ${
                currentPage === totalPages
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface hover:bg-surface-variant'
              }`}
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
