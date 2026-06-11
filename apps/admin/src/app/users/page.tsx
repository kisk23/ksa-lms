'use client';

import {
  UsersHeader,
  UsersFilters,
  UsersTable,
  AddUserModal,
  fetchUsers,
  updateUser,
} from '@features/user-management';
import type { RoleFilter, StatusFilter, User } from '@features/user-management';
import { useState, useMemo, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<RoleFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [academicYear, setAcademicYear] = useState('all');
  const [country, setCountry] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const PAGE_SIZE = 6;

  // Search input debounce handler
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  const loadUsers = async (silent = false, customPage = page) => {
    try {
      if (!silent) setIsTableLoading(true);
      setError(null);

      const response = await fetchUsers({
        page: customPage,
        limit: PAGE_SIZE,
        role: role === 'all' ? undefined : role,
        search: debouncedSearch.trim() || undefined,
        status: status === 'all' ? undefined : status,
      });

      setUsers(response.data || []);
      setTotalItems(response.meta.total || 0);
      setTotalPages(response.meta.totalPages || 1);
    } catch (err) {
      const error = err as Error;
      console.error('loadUsers API error:', error);
      if (!silent) setUsers([]); // Clear previous user state on error only if not initial load
      setError(error.message || 'حدث خطأ أثناء تحميل بيانات المستخدمين من الخادم.');
    } finally {
      setIsInitialLoading(false);
      setIsTableLoading(false);
    }
  };

  // Fetch users when page, role, status, or debouncedSearch changes
  useEffect(() => {
    loadUsers(false, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, status, debouncedSearch]);

  const handleRoleChange = (newRole: RoleFilter) => {
    setRole(newRole);
    setPage(1);
  };

  const handleStatusChange = (newStatus: StatusFilter) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleResetFilters = () => {
    setGrade('all');
    setAcademicYear('all');
    setCountry('all');
    setPage(1);
  };

  const handleBanUser = async (userId: string) => {
    // 1. Optimistic update
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: 'blocked' as const } : u)),
    );
    try {
      setError(null);
      await updateUser(userId, { isActive: false });
      // 2. Silent refresh in background
      await loadUsers(true, page);
    } catch (err) {
      const error = err as Error;
      // 3. Rollback on failure
      await loadUsers(true, page);
      setError(error.message || 'حدث خطأ أثناء حظر المستخدم.');
    }
  };

  const handleApproveUser = async (userId: string) => {
    // 1. Optimistic update
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: 'active' as const } : u)),
    );
    try {
      setError(null);
      await updateUser(userId, { isActive: true, isVerified: true });
      // 2. Silent refresh in background
      await loadUsers(true, page);
    } catch (err) {
      const error = err as Error;
      // 3. Rollback on failure
      await loadUsers(true, page);
      setError(error.message || 'حدث خطأ أثناء الموافقة على المستخدم.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Advanced filters (mock attributes left for future expansion/filtering)
      if (grade !== 'all' && user.grade !== grade) return false;
      if (academicYear !== 'all' && user.academicYear !== academicYear) return false;
      if (country !== 'all' && user.country !== country) return false;

      return true;
    });
  }, [users, grade, academicYear, country]);

  if (isInitialLoading) {
    return (
      <div
        className="max-w-7xl mx-auto flex flex-col items-center justify-center py-32 gap-4"
        dir="rtl"
      >
        <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
        <p className="font-body-md-ar text-on-surface-variant font-medium">
          جاري تحميل بيانات المستخدمين من النظام...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-xl">
      <UsersHeader onAddUser={() => setIsAddModalOpen(true)} />

      {error && (
        <div
          className="p-4 bg-error-container/10 border border-error/20 text-error rounded-xl font-body-md-ar text-sm text-right"
          dir="rtl"
        >
          {error}
        </div>
      )}

      <UsersFilters
        role={role}
        status={status}
        search={search}
        grade={grade}
        academicYear={academicYear}
        country={country}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
        onGradeChange={(val) => {
          setGrade(val);
          setPage(1);
        }}
        onAcademicYearChange={(val) => {
          setAcademicYear(val);
          setPage(1);
        }}
        onCountryChange={(val) => {
          setCountry(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
      />
      <UsersTable
        users={filteredUsers}
        pageSize={PAGE_SIZE}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        isLoading={isTableLoading}
        onBanUser={handleBanUser}
        onApproveUser={handleApproveUser}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={() => {
          setPage(1);
          loadUsers(false, 1);
        }}
      />
    </div>
  );
}
