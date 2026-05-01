'use client';

import { useState, useRef } from 'react';

export default function CourseHero() {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1e293b] group"
      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={hasStarted}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        disablePictureInPicture
        poster="https://lh3.googleusercontent.com/aida-public/AB6AXuAypXQQuA-Z8oGXhpdmaFyPRbsypZzgzVc8vrSUtxtQ2RAw5TETCTcj51H2zKcWj7KuIPS8bXbhD0VRaY82QhRdWYNp8TsTCq2lvGzz5Y3JzJfc8EWM96e5DnSs6jnnsarV6H3VxrzfGhU953kAzR02zga8DPdtPcyWAlZHCYH3s0rSNCsqDgdzQstLiq4_dygZtxnBV4TUtRa6bbM_LpJH57k3BVaKE1N_mgizEPRt0MZThtxwEb0qn-T5KJXPrn-zqNoD9XdL76_U"
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!hasStarted && (
        <div
          className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-200 group-hover:bg-black/45 cursor-pointer"
          onClick={handlePlay}
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            {/* Play icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-primary translate-x-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
