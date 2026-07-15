"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Teacher } from "@lms/shared-types/src/models/index.ts";
import { Breadcrumbs } from "@/features/teachers/components/Breadcrumbs";
import { PageHeader } from "@/features/teachers/components/PageHeader";
import { TeachersToolbar } from "@/features/teachers/components/TeachersToolbar";
import { TeacherGrid } from "@/features/teachers/components/TeacherGrid";
import { LoadingSkeleton } from "@/features/teachers/components/LoadingSkeleton";
import { EmptyState } from "@/features/teachers/components/EmptyState";
import { useTeachers } from "@/features/teachers/hooks/useTeachers";
import { sortOptions } from "@/features/teachers/sortOptions";
import { TeachersCtaSection } from "@/features/teachers/components/TeachersCtaSection";

export default function TeachersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subject");
  const subjectLabel = searchParams.get("subjectLabel") ?? subjectId ?? "المادة";

  const stageId = searchParams.get("stage");
  let stageLabel = "";
  if (stageId == "middle") {
    stageLabel = "المتوسطة";
  } else if (stageId == "primary") {
    stageLabel = "الابتدائية";
  } else if (stageId == "secondary") {
    stageLabel = "الثانوية";
  } else {
    stageLabel = "";
  }

  const { teachers, isLoading, error, sortBy, setSortBy, retry } =
    useTeachers(subjectId);

  const handleSelectTeacher = (teacher: Teacher) => {
    router.push(`/courses?teacher=${teacher.id}&subject=${teacher.subjectId}`);
  };

  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: "المواد", href: "/subjects" },
    { label: `معلمو المرحلة ${stageLabel} لمادة ${subjectLabel}` },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <div className="mb-8">
        <PageHeader
          title={`معلمو ${subjectLabel}`}
          description="اختر معلمك المفضل واستعرض كورساته لتبدأ رحلة التعلم نحو النجاح."
          stage={stageLabel}
          subject={subjectLabel}
          teacherCount={teachers.length}
        />
      </div>

      {/* Error State */}
      {error && (
        <div
          role="alert"
          className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-error/30 bg-error-container/30 px-6 py-10 text-center"
        >
          <span
            className="material-symbols-outlined text-[40px] text-error"
            aria-hidden="true"
          >
            error_outline
          </span>
          <p className="text-lg font-semibold text-on-error-container">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-lg bg-error px-6 py-2 font-bold text-on-error transition-opacity hover:opacity-90"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Toolbar — shown only when not in error and teachers/loading are present */}
      {!error && (
        <TeachersToolbar
          count={isLoading ? 0 : teachers.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton count={8} />
      ) : !error && teachers.length === 0 ? (
        <EmptyState />
      ) : !error ? (
        <TeacherGrid teachers={teachers} onSelectTeacher={handleSelectTeacher} />
      ) : null}

      {/* CTA Section */}
      <div className="mt-16">
        <TeachersCtaSection
          browseSubjectsHref="/subjects"
          contactHref="#"
        />
      </div>
    </main>
  );
}
