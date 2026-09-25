'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  /** Extra element on the LEFT side of the label row (e.g. a link) */
  labelSuffix?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, labelSuffix, className = '', id, ...props }, ref) => {
    // Stable id so <label htmlFor> is always associated with the input,
    // even when consumers don't pass one explicitly.
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor={inputId}
            className="text-[14px] leading-normal font-semibold text-[#0f1a37] font-arabic"
          >
            {label}
          </label>
          {labelSuffix}
        </div>

        <div className="relative group">
          {icon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747685] group-focus-within:text-primary transition-colors pointer-events-none">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
            className={[
              'w-full bg-white border rounded-lg px-4 py-3',
              'text-[16px] leading-[1.6] text-[#0f1a37] placeholder:text-[#747685]',
              'font-arabic',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus:border-primary',
              'transition-all duration-200 shadow-sm',
              icon ? 'pr-12' : '',
              error
                ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus-visible:ring-[#ba1a1a]/20'
                : 'border-[#c4c5d6]',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </div>

        {error && (
          <p id={errorId} className="text-[#ba1a1a] text-[13px] font-arabic" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
