import { UserRow } from './UserRow';
import type { User } from '../types';
import { UsersPagination } from './UsersPagination';

type UsersTableProps = {
  users: User[];
};

const columns = ['المستخدم', 'البريد الإلكتروني', 'الدور', 'تاريخ التسجيل', 'الحالة'];

export function UsersTable({ users }: UsersTableProps) {
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
            {users.map((user, idx) => (
              <UserRow key={user.id} user={user} zebra={idx % 2 === 1} />
            ))}
          </tbody>
        </table>
      </div>

      <UsersPagination currentPage={1} totalPages={25} totalItems={245} pageSize={10} />
    </div>
  );
}
