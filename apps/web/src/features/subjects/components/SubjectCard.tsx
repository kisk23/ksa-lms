import type { Subject } from '@/features/subjects/types/study';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const formattedTeacherCount = subject.teacherCount.toLocaleString('ar-EG');

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${subject.name}، ${formattedTeacherCount} معلم متاح`}
      className="group flex min-h-40 w-full flex-col justify-between rounded-2xl border border-outline-variant bg-white p-6 text-right transition-all duration-300 hover:-translate-y-1 hover:border-primary-container hover:shadow-lg focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-container cursor-pointer"
    >
      <div className="flex flex-1 items-center justify-center">
        <h3 className="text-xl font-bold leading-relaxed text-on-surface transition-colors duration-300 group-hover:text-primary-container">
          {subject.name}
        </h3>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
        <span>{formattedTeacherCount} معلم متاح</span>

        <span className="translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          ←
        </span>
      </div>
    </button>
  );
}
