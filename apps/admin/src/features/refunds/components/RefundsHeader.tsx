import { Button } from '@shared/components/ui/Button';
import { Download } from 'lucide-react';

export function RefundsHeader() {
  const handleExport = () => {
    // TODO: Implement export logic
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
      <div>
        {/* Breadcrumb */}
        <h1 className="font-h1-ar text-h1-ar text-on-surface">طلبات الاسترجاع</h1>
      </div>

      <Button variant="secondary" icon={Download} onClick={handleExport}>
        تصدير التقرير
      </Button>
    </div>
  );
}
