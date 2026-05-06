interface TagProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'default';
  size?: 'sm' | 'md';
}

const VARIANT_CLASSES = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  default: 'bg-surface-container-high text-on-surface',
};

const SIZE_CLASSES = {
  sm: 'px-sm py-[2px] text-caption-ar',
  md: 'px-3 py-1 text-caption-ar',
};

export function Tag({ label, variant = 'default', size = 'md' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-caption-ar ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}`}
    >
      {label}
    </span>
  );
}
