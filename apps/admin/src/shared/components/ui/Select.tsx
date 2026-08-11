import type { ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

export function Select({ label, options, value, onChange, className = '' }: SelectProps) {
  return (
    <div className={`flex-1 min-w-[200px] ${className}`}>
      {label && (
        <label className="block font-caption-ar text-caption-ar text-on-surface-variant mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-surface py-2 px-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md-ar text-body-md-ar text-on-surface"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
