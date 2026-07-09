'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  youtubeVideoId: string;
  title: string;
}

/**
 * VideoPlayer
 *
 * Shows a thumbnail + play button overlay on first render.
 * On click, swaps to a YouTube iframe with autoplay.
 * This avoids loading the heavy YouTube embed script until the user
 * actually wants to watch, improving page performance.
 */
export function VideoPlayer({ youtubeVideoId, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const thumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`;

  if (playing) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(15,26,55,0.2)]">
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0f1a37] shadow-[0_8px_32px_rgba(15,26,55,0.2)] group cursor-pointer"
      onClick={() => setPlaying(true)}
      role="button"
      aria-label={`تشغيل ${title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setPlaying(true)}
    >
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-20 h-20 bg-primary/90 hover:bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <Play size={36} className="text-white fill-white translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}
