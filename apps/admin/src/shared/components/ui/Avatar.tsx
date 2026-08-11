import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-8 h-8', img: 32 },
  md: { box: 'w-10 h-10', img: 40 },
  lg: { box: 'w-12 h-12', img: 48 },
};

export function Avatar({ src, alt = '', fallback, size = 'md', className = '' }: AvatarProps) {
  const { box, img } = sizeMap[size];

  return (
    <div
      className={`${box} rounded-full overflow-hidden bg-surface-variant flex-shrink-0 flex items-center justify-center text-on-surface-variant font-medium ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={img}
          height={img}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
