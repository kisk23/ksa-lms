import type { FormFieldProps } from '../types';

export function FormField({ label, icon: Icon, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block font-caption-ar text-caption-ar text-on-surface-variant">
        {label}
      </label>
      <div className="relative w-full">
        {Icon && (
          <Icon
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
          />
        )}
        {children}
      </div>
      {error && <p className="text-xs text-error font-caption-ar mt-1">{error}</p>}
    </div>
  );
}
