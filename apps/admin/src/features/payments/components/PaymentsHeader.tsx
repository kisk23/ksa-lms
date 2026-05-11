import { Button } from '@shared/components/ui/Button';
import { Download } from 'lucide-react';

export function PaymentsHeader() {
  const handleExport = () => {
    // TODO: Implement export logic
  };

  return (
    <div className="flex justify-between items-end mb-xl">
      <div>
        <h1 className="font-h1-ar text-h1-ar text-on-background mb-2">إدارة المدفوعات</h1>
        <p className="font-caption-ar text-caption-ar text-outline">
          نظرة عامة على الإيرادات والعمليات المالية.
        </p>
      </div>

      <Button variant="secondary" icon={Download} onClick={handleExport}>
        تصدير التقرير
      </Button>
    </div>
  );
}
