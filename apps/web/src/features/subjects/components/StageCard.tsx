interface StageCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function StageCard({
  title,
  description,
  onClick,
}: StageCardProps) {
  return (
    <button
  type="button"
  onClick={onClick}
  aria-label={`اختر المرحلة ${title}`}
  className="group relative flex min-h-64 w-full flex-col overflow-hidden rounded-3xl border border-outline-variant bg-white p-8 text-right transition-all duration-300 hover:-translate-y-2 hover:border-primary-container hover:shadow-xl focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-container cursor-pointer"
>
  {/* Top Accent */}
  <div className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-primary-container transition-transform duration-300 group-hover:scale-x-100" />

  {/* Stage Badge */}
  <span className="mb-8 inline-flex w-fit rounded-full bg-primary-container/10 px-4 py-1 text-sm font-semibold text-primary-container">
    المرحلة الدراسية
  </span>

  {/* Stage Name */}
  <h3 className="mb-3 text-3xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary-container">
    {title}
  </h3>

  {/* Description */}
  <p className="flex-1 text-sm leading-7 text-on-surface-variant">
    {description}
  </p>

  {/* Footer */}
  <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-4">
    <span className="text-sm font-medium text-primary-container">
      اختر المرحلة
    </span>

    <span className="translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
      ←
    </span>
  </div>

  {/* Decorative Background */}
  <span
    className="pointer-events-none absolute bottom-10 left-5 text-[100px] font-black leading-none text-primary-container/5 transition-transform duration-300 group-hover:scale-110"
    aria-hidden="true"
  >
    {title}
  </span>
</button>
  );
}
