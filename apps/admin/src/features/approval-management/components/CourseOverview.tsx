import { Play } from 'lucide-react';
import Image from 'next/image';

type CourseOverviewProps = {
  imageUrl: string;
  duration: string;
  tags: string[];
  description: string;
};

export function CourseOverview({ imageUrl, duration, tags, description }: CourseOverviewProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <h2 className="font-h2-ar text-h2-ar text-on-background mb-sm">نظرة عامة على المقرر</h2>

      {/* Video Preview */}
      <div className="relative w-full aspect-video bg-surface-container rounded-lg overflow-hidden mb-md group/video cursor-pointer border border-outline-variant shadow-inner">
        <Image
          src={imageUrl}
          alt="Course preview"
          fill
          className="object-cover transition-transform duration-700 group-hover/video:scale-105"
        />
        <div className="absolute inset-0 bg-on-background/40 flex items-center justify-center transition-colors duration-300 group-hover/video:bg-on-background/30">
          <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover/video:scale-110">
            <Play size={32} className="text-primary fill-primary" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-on-background/80 text-surface-container-lowest px-3 py-1 rounded text-caption-ar font-caption-ar">
          {duration}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-md">
        {tags.map((tag, idx) => (
          <span
            key={tag}
            className={`px-3 py-1 rounded-full text-caption-ar font-caption-ar ${
              idx === 0
                ? 'bg-primary-fixed text-on-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="font-body-md-ar text-body-md-ar text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </section>
  );
}
