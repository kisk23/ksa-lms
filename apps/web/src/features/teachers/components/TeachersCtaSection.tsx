import Link from "next/link";
import { ArrowLeft, BookOpen, MessageCircle } from "lucide-react";

interface TeachersCtaSectionProps {
  browseSubjectsHref: string;
  contactHref: string;
}

export function TeachersCtaSection({
  browseSubjectsHref,
  contactHref,
}: TeachersCtaSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-low px-8 py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-primary-container">
          <BookOpen className="h-8 w-8" />
        </div>

        <h2 className="mb-3 text-3xl font-bold text-on-surface">
          لم تجد المعلم المناسب؟
        </h2>

        <p className="mb-8 max-w-2xl text-lg leading-8 text-on-surface-variant">
          استكشف المزيد من المواد الدراسية أو تواصل معنا لمساعدتك في اختيار
          المعلم الذي يناسب احتياجاتك التعليمية.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={browseSubjectsHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 font-medium text-primary-fixed transition-colors hover:bg-primary"
          >
            <BookOpen className="h-5 w-5" />
            استعرض المواد
          </Link>

          <Link
            href={contactHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-3 font-medium text-on-surface transition-colors hover:bg-surface-container"
          >
            <MessageCircle className="h-5 w-5" />
            تواصل معنا
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}