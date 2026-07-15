interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "لا يوجد معلمون متاحون حالياً",
  description = "نعمل على إضافة معلمين لهذه المادة قريباً، يرجى المحاولة لاحقاً.",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="mb-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant" aria-hidden="true">
          person_search
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold text-on-surface">{title}</h3>
      <p className="max-w-sm text-base text-on-surface-variant">{description}</p>
    </div>
  );
}
