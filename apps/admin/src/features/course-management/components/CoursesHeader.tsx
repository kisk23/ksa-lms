import { Button } from '@shared/components/ui/Button';
import { Plus } from 'lucide-react';

export function CoursesHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-margin pt-xl">
      <div className="flex flex-col gap-sm">
        <h1 className="font-h1-ar text-h1-ar text-on-surface">إدارة الكورسات</h1>
        <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">
          عرض وتعديل ومتابعة حالة جميع الكورسات في النظام.
        </p>
      </div>

      <Button icon={Plus}>إضافة دورة جديدة</Button>
    </div>
  );
}
