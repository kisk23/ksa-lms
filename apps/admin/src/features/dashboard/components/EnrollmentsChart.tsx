import { Card } from '@shared/components/ui/Card';

const legend = [
  { color: 'bg-primary', label: 'طلاب جدد', value: '65%' },
  { color: 'bg-tertiary', label: 'معلمين', value: '25%' },
  { color: 'bg-surface-container-highest', label: 'أولياء أمور', value: '10%' },
];

export function EnrollmentsChart() {
  return (
    <Card>
      <h3 className="text-h2-ar font-h2-ar text-on-surface mb-md">التسجيلات الأخيرة</h3>

      <div className="flex items-center justify-center h-[200px] relative mb-md">
        <div className="w-40 h-40 rounded-full border-[12px] border-surface-container border-r-primary border-t-primary border-l-tertiary rotate-45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-h2-ar font-h2-ar text-on-surface">324</span>
          <span className="text-caption-ar font-caption-ar text-outline">هذا الأسبوع</span>
        </div>
      </div>

      <div className="space-y-sm">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-caption-ar font-caption-ar"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-on-surface">{item.label}</span>
            </div>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
