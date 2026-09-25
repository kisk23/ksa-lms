'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Omit or pass an empty string when the field already has a visible label */
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    // Stable id so <label htmlFor> is always associated with the input.
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-[14px] leading-normal font-semibold text-[#0f1a37] font-arabic"
          >
            {label}
          </label>
        ) : null}

        <div className="relative group">
          {/* Lock icon — right side (RTL) */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747685] group-focus-within:text-primary transition-colors pointer-events-none">
            <Lock className="w-5 h-5" />
          </span>

          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
            className={[
              'w-full bg-white border rounded-lg px-4 py-3 pr-12 pl-12',
              'text-[16px] leading-[1.6] text-[#0f1a37] placeholder:text-[#747685]',
              'font-arabic',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus:border-primary',
              'transition-all duration-200 shadow-sm',
              error
                ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus-visible:ring-[#ba1a1a]/20'
                : 'border-[#c4c5d6]',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {/* Toggle — left side (RTL layout → visually left).
              ≥44×44px hit area + visible focus ring for keyboard/touch users. */}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            aria-pressed={visible}
            className="absolute left-0.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-[#747685] hover:text-[#0f1a37] hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
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

PasswordInput.displayName = 'PasswordInput';
