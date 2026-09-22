import { Download, FileText, AlertCircle } from 'lucide-react';

import type { LessonFile } from '../types';

interface LessonFilesProps {
  files: LessonFile[];
  isLoading: boolean;
  error: Error | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * LessonFiles
 *
 * Renders downloadable files attached to a lesson.
 * LessonFile is not yet in the Prisma schema — this component
 * shows an empty state gracefully until the backend adds support.
 */
export function LessonFiles({ files, isLoading, error }: LessonFilesProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    const isNotFound = (error as any)?.response?.status === 404;
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <AlertCircle size={18} className="shrink-0" />
        {isNotFound ? 'لا تتوفر ملفات لهذا الدرس.' : 'تعذّر تحميل الملفات. يرجى المحاولة لاحقاً.'}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
        <FileText size={36} />
        <p className="text-sm">لا توجد ملفات مرفقة بهذا الدرس.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" dir="rtl">
      {files.map((file) => (
        <a
          key={file.id}
          href={file.url}
          download={file.name}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <FileText
              size={20}
              className="text-gray-400 group-hover:text-primary transition-colors shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">{formatBytes(file.sizeBytes)}</p>
            </div>
          </div>
          <Download
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors shrink-0"
          />
        </a>
      ))}
    </div>
  );
}
