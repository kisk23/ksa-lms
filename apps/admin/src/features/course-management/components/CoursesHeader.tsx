'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/Button';

export function CoursesHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-margin pt-xl">
      <div className="flex flex-col gap-sm">
        <h1 className="font-h1-ar text-h1-ar text-on-surface">إدارة الكورسات</h1>
        <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">
          عرض وتعديل ومتابعة حالة جميع الكورسات في النظام من خلال واجهة موحدة.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        icon={Plus}
        onClick={() => router.push('/courses/create')}
      >
        إضافة دورة جديدة
      </Button>
    </div>
  );
}
