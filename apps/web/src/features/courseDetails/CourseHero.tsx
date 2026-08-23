'use client';

import { useRef, useState } from 'react';

interface CourseHeroProps {
  /** YouTube video ID from the first non-archived lesson, or undefined while loading */
  youtubeVideoId?: string | null;
  /** Thumbnail URL — omit to use YouTube's auto-generated thumbnail */
  posterUrl?: string | null;
  title?: string;
}

export default function CourseHero({ youtubeVideoId, posterUrl, title }: CourseHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If we have a YouTube ID, render an embed; otherwise fall back to a <video>
  if (youtubeVideoId) {
    const ytThumbnail =
      posterUrl ?? `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;

    if (!isPlaying) {
      return (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`تشغيل ${title ?? 'الفيديو التعريفي'}`}
          className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface group cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] block p-0 border-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ytThumbnail}
            alt={title ?? 'Course thumbnail'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition-colors">
            <span className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-primary translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </span>
        </button>
      );
    }

    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title ?? 'Course video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Fallback: generic <video> element (no YouTube ID yet)
  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface group shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
      <video
        ref={videoRef}
        className="w-full h-full object-cover "
        controls={isPlaying}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        disablePictureInPicture
        poster={posterUrl ?? undefined}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
      </video>

      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="تشغيل الفيديو"
          className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition-colors cursor-pointer p-0 border-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        >
          <span className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-primary translate-x-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
