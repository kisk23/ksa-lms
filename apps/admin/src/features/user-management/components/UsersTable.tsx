'use client';

import { Pagination } from '@shared/components/ui/Pagination';
import { useState, useMemo, useEffect } from 'react';

import { UserRow } from './UserRow';
import type { User } from '../types';

type UsersTableProps = {
  users: User[];
  pageSize?: number;
  onBanUser?: (userId: string) => void;
  onApproveUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
};

const columns = ['المستخدم', 'البريد الإلكتروني', 'الدور', 'تاريخ التسجيل', 'الحالة'];

export function UsersTable({
  users,
  pageSize = 6,
  onBanUser,
  onApproveUser,
  onDeleteUser,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the filtered list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const totalItems = users.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const visibleUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card-soft border border-outline-variant/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
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
            {visibleUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-on-surface-variant font-caption-ar"
                >
                  لا توجد نتائج مطابقة للفلاتر المحددة
                </td>
              </tr>
            ) : (
              visibleUsers.map((user, idx) => (
                <UserRow
                  key={user.id}
                  user={user}
                  zebra={idx % 2 === 1}
                  onBanUser={onBanUser}
                  onApproveUser={onApproveUser}
                  onDeleteUser={onDeleteUser}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="مستخدم"
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
