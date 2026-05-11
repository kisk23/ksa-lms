export function ApprovalsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-xl">
      <div>
        <h2 className="font-h1-ar text-h1-ar text-on-surface mb-1">طلبات الموافقة</h2>
        <p className="font-caption-ar text-caption-ar text-on-surface-variant">
          عرض وإدارة طلبات الموافقة للمحتوى التعليمي
        </p>
      </div>
    </div>
  );
}
