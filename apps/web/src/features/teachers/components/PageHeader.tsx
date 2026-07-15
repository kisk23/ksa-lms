interface PageHeaderProps {
  title: string;
  description: string;
  stage: string;
  subject: string;
  teacherCount?: number;
}

export function PageHeader({
  title,
  description,
  stage,
  subject,
  teacherCount,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest">
      {/* Accent */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2 bg-primary-container"
      />

      {/* Decorative Background */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-fixed opacity-30 blur-3xl"
      />

      <div className="relative z-10 space-y-6 p-8 lg:p-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-on-surface lg:text-4xl">
            {title}
          </h1>

          <p className="max-w-3xl text-base leading-7 text-on-surface-variant lg:text-lg">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-surface-container px-4 py-2 text-sm font-medium text-on-surface">
            {stage}
          </span>

          <span className="rounded-full bg-surface-container px-4 py-2 text-sm font-medium text-on-surface">
            {subject}
          </span>

          {teacherCount !== undefined && (
            <span className="rounded-full bg-primary-fixed px-4 py-2 text-sm font-semibold text-primary-container">
              {teacherCount} معلماً
            </span>
          )}
        </div>
      </div>
    </section>
  );
}