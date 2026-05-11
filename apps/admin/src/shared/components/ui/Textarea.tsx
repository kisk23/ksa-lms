import type { TextareaHTMLAttributes } from 'react';

type TextareaProps = {
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-body-md-ar text-body-md-ar text-on-surface mb-xs">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-2 focus:ring-primary-fixed outline-none resize-none font-body-md-ar text-body-md-ar text-on-surface transition-all ${className}`}
      />
    </div>
  );
}
