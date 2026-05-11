import CourseHero from '@/features/courseDetails/CourseHero';
import CourseInfo from '@/features/courseDetails/CourseInfo';
import Curriculum from '@/features/courseDetails/Curriculum';
import InstructorProfile from '@/features/courseDetails/InstructorProfile';
import PricingCard from '@/features/courseDetails/PricingCard';
import WhatYouLearn from '@/features/courseDetails/WhatYouLearn';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <main
      className="max-w-7xl mx-auto px-6 py-12"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Course Details */}
        <div className="lg:col-span-4">
          <PricingCard />
        </div>

        {/* Right Column: Sticky Pricing */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <CourseHero />
          <CourseInfo />
          <WhatYouLearn />
          <Curriculum />
          <InstructorProfile />
        </div>
      </div>
    </main>
  );
}
