'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  /** Extra element on the LEFT side of the label row (e.g. a link) */
  labelSuffix?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, labelSuffix, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor={props.id}
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
            {...props}
            className={[
              'w-full bg-white border rounded-lg px-4 py-3',
              'text-[16px] leading-[1.6] text-[#0f1a37] placeholder:text-[#747685]',
              'font-arabic',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-all duration-200 shadow-sm',
              icon ? 'pr-12' : '',
              error
                ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                : 'border-[#c4c5d6]',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </div>

        {error && (
          <p className="text-[#ba1a1a] text-[13px] font-arabic" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
