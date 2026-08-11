import { MessageSquareQuote } from 'lucide-react';

interface InstructorNotesProps {
  note: string;
}

export function InstructorNotes({ note }: InstructorNotesProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md">
      <div className="flex items-center gap-2 mb-sm">
        <MessageSquareQuote size={20} className="text-outline" />
        <h2 className="font-h2-ar text-h2-ar text-on-background">ملاحظات المعلم</h2>
      </div>

      <div className="bg-surface-container-low p-sm rounded-lg border-l-4 border-primary">
        <p className="font-body-md-ar text-body-md-ar text-on-surface-variant italic">
          &ldquo;{note}&rdquo;
        </p>
      </div>
    </section>
  );
}
