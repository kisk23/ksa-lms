'use client';

import CTASection from '@/pages/about/components/CTASection';
import HeroSection from '@/pages/about/components/HeroSection';
import HowWeWorkSection from '@/pages/about/components/HowWeWorkSection';
import MissionVisionSection from '@/pages/about/components/MissionVisionSection';
import StorySection from '@/pages/about/components/StorySection';
import ValuesSection from '@/pages/about/components/ValuesSection';
import WhoWeServeSection from '@/pages/about/components/WhoWeServeSection';
import { FullBleed } from '@/shared/components/reusable/FullBleed';


export default function AboutPage() {
  return (
    <FullBleed className="bg-white text-gray-900 min-h-screen">
      <div dir="rtl" lang="ar" className="mx-auto">
        <HeroSection />
        <StorySection />
        <MissionVisionSection />
        <ValuesSection />
        <WhoWeServeSection />
        <HowWeWorkSection />
        <CTASection />
      </div>
    </FullBleed>
  );
}
