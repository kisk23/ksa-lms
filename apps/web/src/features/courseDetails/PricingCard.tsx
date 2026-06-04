
import { Award, BookOpenCheck, Infinity, Share2, TvMinimalPlay } from 'lucide-react';


import type { CourseDetails } from '@/features/courses/types';

interface PricingCardProps {
  course: CourseDetails;
}

const COURSE_FEATURES = [
  { icon: <TvMinimalPlay size={18} />, label: 'فيديوهات يوتيوب داخل المنصة' },
  { icon: <BookOpenCheck size={18} />, label: 'اختبارات نهاية كل وحدة' },
  { icon: <Award size={18} />,         label: 'شهادة إتمام معتمدة من سُلَّم' },
  { icon: <Infinity size={18} />,      label: 'وصول مدى الحياة للمحتوى' },
];


export default function PricingCard({ course }: PricingCardProps) {
  const numericPrice = Number(course.price);
  const isFree = numericPrice === 0;

  const formattedPrice = isFree
    ? 'مجاني'
    : `${numericPrice.toLocaleString('ar-SA')} ${course.currency}`;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: course.title, url: window.location.href }).catch(() => null);
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => null);
    }
  };

  return (
    <div
      className="sticky top-28 rounded-xl border-2 border-gray-200 p-6 flex flex-col gap-6 shadow-2xl bg-white"
      dir="rtl"
    >
      {/* Price */}
      <div className="text-center">
        <div className="text-4xl font-black text-primary  mb-1">{formattedPrice}</div>
        {!isFree && (
          <div className="mt-2 text-xs text-success font-semibold bg-success/10 px-3 py-1 rounded-full inline-block border border-success/20">
            سعر المنصة الرسمي
          </div>

        )}
      </div>

      {/* CTA */}

      <button className="w-full bg-primary  text-white font-bold text-lg py-3 shadow rounded-lg hover:bg-primary-hover transition-colors duration-200 active:scale-95 cursor-pointer">
        {isFree ? 'سجّل مجاناً' : 'اشترك الآن'}

      </button>

      {/* Features */}
      <div className="flex flex-col gap-4">
        <h4 className="font-semibold text-black">تتضمن هذه الدورة:</h4>
        {COURSE_FEATURES.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-gray-600">
            <span className="shrink-0 text-primary ">{f.icon}</span>
            <span className="text-sm">{f.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 text-gray-600">
          <span className="shrink-0 text-primary ">
            <BookOpenCheck size={18} />
          </span>
          <span className="text-sm">
            {course.chapters.length} فصل •{' '}
            {course.chapters.reduce(
              (acc, ch) => acc + ch.lessons.filter((l) => !l.isArchived).length,
              0,
            )}{' '}
            درس
          </span>
        </div>
      </div>

      <hr className="border-gray-200" />


      {/* Share */}
      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className="text-gray-600 hover:text-primary  transition-colors flex items-center gap-2 cursor-pointer text-sm"
        >
          <Share2 size={16} />
          <span>مشاركة الدورة</span>
        </button>
      </div>
    </div>
  );
}