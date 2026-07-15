import type { Teacher } from "@lms/shared-types/src/models/index.ts";
import { TeacherCard } from "./TeacherCard";

interface TeacherGridProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
}

export function TeacherGrid({ teachers, onSelectTeacher }: TeacherGridProps) {
  return (
    <div
      className="mb-16 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      role="list"
      aria-label="قائمة المعلمين"
    >
      {teachers.map((teacher) => (
        <div key={teacher.id} role="listitem" className="h-full">
          <TeacherCard teacher={teacher} onSelect={onSelectTeacher} />
        </div>
      ))}
    </div>
  );
}
