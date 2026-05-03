import { UsersHeader, UsersFilters, UsersTable, MOCK_USERS } from '@features/user-management';

export default function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <UsersHeader />
      <UsersFilters />
      <UsersTable users={MOCK_USERS} />
    </div>
  );
}
