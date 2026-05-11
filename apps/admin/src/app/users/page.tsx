'use client';

import { UsersHeader, UsersFilters, UsersTable, MOCK_USERS } from '@features/user-management';
import type { RoleFilter, StatusFilter } from '@features/user-management';
import { useState, useMemo } from 'react';

export default function UsersPage() {
  const [role, setRole] = useState<RoleFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      if (role !== 'all' && user.role !== role) return false;
      if (status !== 'all' && user.status !== status) return false;
      return true;
    });
  }, [role, status]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <UsersHeader />
      <UsersFilters role={role} status={status} onRoleChange={setRole} onStatusChange={setStatus} />
      <UsersTable users={filteredUsers} />
    </div>
  );
}
