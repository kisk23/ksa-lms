import type { Teacher } from "@lms/shared-types/src/models/index.ts";

interface TeacherCardProps {
  teacher: Teacher;
  onSelect: (teacher: Teacher) => void;
}

function getInitials(name: string): string {
  const cleaned = name.replace(/^(د\.|أ\.|م\.)\s*/, "");
  return cleaned.trim().slice(0, 1);
}

export function TeacherCard({ teacher, onSelect }: TeacherCardProps) {
  const formattedStudents = teacher.studentsCount.toLocaleString("ar-EG");

  return (
    <article className="group flex h-full flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative mb-4">
        <div className="h-24 w-24 rounded-full bg-linear-to-tr from-primary-fixed-dim to-primary-container p-1">
          {teacher.image ? (
            <img
              src={teacher.image}
              alt={`الصورة الشخصية لـ ${teacher.name}`}
              className="h-full w-full rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-surface-container text-2xl font-bold text-primary-container"
              aria-hidden="true"
            >
              {getInitials(teacher.name)}
            </div>
          )}
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary-fixed-dim bg-surface-container-low px-3 py-1 text-sm font-semibold text-primary-container shadow-sm">
          {teacher.subjectLabel}
        </div>
      </div>

      <h3 className="mt-2 mb-1 text-xl font-bold text-on-surface transition-colors group-hover:text-primary-container">
        {teacher.name}
      </h3>
      <p className="mb-3 text-sm text-on-surface-variant">{teacher.title}</p>

      <div className="mb-6 flex w-full flex-col items-center gap-1 rounded-lg bg-surface-container-low p-2">
        <div className="flex items-center gap-1 text-warning">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            star
          </span>
          <span className="mr-1 font-bold text-on-surface">{teacher.rating.toFixed(1)}</span>
        </div>
        <span className="text-sm text-gray-500">(+{formattedStudents} طالب)</span>
      </div>

      <button
        type="button"
        onClick={() => onSelect(teacher)}
        aria-label={`عرض كورسات ${teacher.name}`}
        className="mt-auto w-full rounded-lg bg-primary-fixed px-4 py-2 text-base font-bold text-primary-container transition-all duration-200 hover:bg-primary-container hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-container"
      >
        عرض الكورس
      </button>
    </article>
  );
}
