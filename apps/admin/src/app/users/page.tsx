'use client';

import {
  UsersHeader,
  UsersFilters,
  UsersTable,
  AddUserModal,
  MOCK_USERS,
} from '@features/user-management';
import type { RoleFilter, StatusFilter } from '@features/user-management';
import { useState, useMemo } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [role, setRole] = useState<RoleFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [academicYear, setAcademicYear] = useState('all');
  const [country, setCountry] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleResetFilters = () => {
    setGrade('all');
    setAcademicYear('all');
    setCountry('all');
  };

  const handleBanUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'blocked' } : u)));
  };

  const handleApproveUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'active' } : u)));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (role !== 'all' && user.role !== role) return false;
      if (status !== 'all' && user.status !== status) return false;

      // Search filter
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(query);
        const matchesEmail = user.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Advanced filters
      if (grade !== 'all' && user.grade !== grade) return false;
      if (academicYear !== 'all' && user.academicYear !== academicYear) return false;
      if (country !== 'all' && user.country !== country) return false;

      return true;
    });
  }, [users, role, status, search, grade, academicYear, country]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <UsersHeader onAddUser={() => setIsAddModalOpen(true)} />
      <UsersFilters
        role={role}
        status={status}
        search={search}
        grade={grade}
        academicYear={academicYear}
        country={country}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onGradeChange={setGrade}
        onAcademicYearChange={setAcademicYear}
        onCountryChange={setCountry}
        onResetFilters={handleResetFilters}
      />
      <UsersTable
        users={filteredUsers}
        onBanUser={handleBanUser}
        onApproveUser={handleApproveUser}
        onDeleteUser={handleDeleteUser}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={(newUser) => setUsers((prev) => [newUser, ...prev])}
      />
    </div>
  );
}
