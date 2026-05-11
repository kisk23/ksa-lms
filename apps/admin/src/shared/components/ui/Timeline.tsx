export type TimelineItemStatus = 'current' | 'past' | 'future';

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  status?: TimelineItemStatus;
};

type TimelineProps = {
  items: TimelineItem[];
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative rtl:pr-4 border-r-2 border-outline-variant rtl:mr-4 space-y-6">
      {items.map((item) => {
        const isCurrent = item.status === 'current';
        return (
          <div key={item.id} className="relative">
            <span
              className={`absolute rtl:-right-[25px] top-1 w-4 h-4 rounded-full ring-4 ring-surface-container-lowest ${
                isCurrent
                  ? 'bg-primary'
                  : 'bg-surface-container-high border-2 border-outline-variant'
              }`}
            />
            <div className="rtl:pr-4">
              <h3
                className={`font-body-md-ar text-body-md-ar font-semibold ${
                  isCurrent ? 'text-on-surface' : 'text-outline'
                }`}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="text-caption-ar font-caption-ar text-outline mt-1">
                  {item.description}
                </p>
              )}
              {item.meta && (
                <p className="text-caption-ar font-caption-ar text-outline">{item.meta}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
