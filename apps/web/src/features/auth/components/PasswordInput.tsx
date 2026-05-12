'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={props.id}
          className="text-[14px] leading-normal font-semibold text-[#0f1a37] font-arabic"
        >
          {label}
        </label>

        <div className="relative group">
          {/* Lock icon — right side (RTL) */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747685] group-focus-within:text-primary transition-colors pointer-events-none">
            <Lock className="w-5 h-5" />
          </span>

          <input
            ref={ref}
            {...props}
            type={visible ? 'text' : 'password'}
            className={[
              'w-full bg-white border rounded-lg px-4 py-3 pr-12 pl-12',
              'text-[16px] leading-[1.6] text-[#0f1a37] placeholder:text-[#747685]',
              'font-arabic',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-all duration-200 shadow-sm',
              error
                ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                : 'border-[#c4c5d6]',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {/* Toggle — left side (RTL layout → visually left) */}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747685] hover:text-[#0f1a37] transition-colors focus:outline-none"
          >
            {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
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

PasswordInput.displayName = 'PasswordInput';
