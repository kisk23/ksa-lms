'use client';

import { Pagination } from '@shared/components/ui/Pagination';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';

import { UserRow } from './UserRow';
import type { User } from '../types';

type UsersTableProps = {
  users: User[];
  pageSize?: number;
  onBanUser?: (userId: string) => void;
  onApproveUser?: (userId: string) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
};

const columns = ['المستخدم', 'البريد الإلكتروني', 'الدور', 'تاريخ التسجيل', 'الحالة'];

export function UsersTable({
  users,
  pageSize = 6,
  onBanUser,
  onApproveUser,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  isLoading = false,
}: UsersTableProps) {
  const [clientPage, setClientPage] = useState(1);

  const isServerSide = !!onPageChange;

  const actualCurrentPage = isServerSide ? currentPage : clientPage;
  const actualTotalItems = isServerSide ? totalItems : users.length;
  const actualTotalPages = isServerSide
    ? totalPages
    : Math.max(1, Math.ceil(actualTotalItems / pageSize));

  const handlePageChange = isServerSide ? onPageChange : setClientPage;

  // Reset to page 1 whenever the list changes (only for client-side pagination)
  useEffect(() => {
    if (!isServerSide) {
      setClientPage(1);
    }
  }, [users, isServerSide]);

  const visibleUsers = useMemo(() => {
    if (isServerSide) return users;
    const start = (actualCurrentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, actualCurrentPage, pageSize, isServerSide]);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card-soft border border-outline-variant/20 overflow-hidden relative">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Loading progress bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-container/20 overflow-hidden z-20">
            <motion.div
              initial={{ left: '-100%', width: '100%' }}
              animate={{ left: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 bg-primary w-1/3"
            />
          </div>
        )}
        <table
          className={`w-full text-right border-collapse transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30 font-caption-ar text-caption-ar text-on-surface-variant">
              {columns.map((col) => (
                <th key={col} className="py-4 px-6 font-medium">
                  {col}
                </th>
              ))}
              <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="font-body-md-ar text-sm text-on-surface divide-y divide-outline-variant/10">
            <AnimatePresence mode="popLayout">
              {visibleUsers.length === 0 ? (
                <motion.tr
                  key="empty-state"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <td
                    colSpan={columns.length + 1}
                    className="py-12 text-center text-on-surface-variant font-caption-ar"
                  >
                    لا توجد نتائج مطابقة للفلاتر المحددة
                  </td>
                </motion.tr>
              ) : (
                visibleUsers.map((user, idx) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    zebra={idx % 2 === 1}
                    onBanUser={onBanUser}
                    onApproveUser={onApproveUser}
                  />
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={actualCurrentPage}
        totalPages={actualTotalPages}
        totalItems={actualTotalItems}
        pageSize={pageSize}
        itemLabel="مستخدم"
        onPageChange={handlePageChange}
      />
    </div>
  );
}
