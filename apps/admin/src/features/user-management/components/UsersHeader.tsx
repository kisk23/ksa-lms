import { Button } from '@shared/components/ui/Button';
import { Plus } from 'lucide-react';

interface UsersHeaderProps {
  onAddUser?: () => void;
}

export function UsersHeader({ onAddUser }: UsersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-xl">
      <div>
        <h2 className="font-h1-ar text-h1-ar text-on-surface mb-1">إدارة المستخدمين</h2>
        <p className="font-caption-ar text-caption-ar text-on-surface-variant">
          عرض وإدارة جميع حسابات المستخدمين في المنصة
        </p>
      </div>

      <Button icon={Plus} onClick={onAddUser}>
        إضافة مستخدم جديد
      </Button>
    </div>
  );
}
