import { Award, BookOpenCheck, Infinity, Newspaper, Share2, TvMinimalPlay } from 'lucide-react';

const features = [
  {
    icon: <TvMinimalPlay />,
    label: '12 ساعة من الفيديو القابل للتنزيل',
  },
  {
    icon: <Newspaper />,
    label: '24 مقالاً للقراءة المعمقة',
  },
  {
    icon: <BookOpenCheck />,
    label: 'اختبارات نهاية كل وحدة لتقييم الفهم',
  },
  {
    icon: <Award />,
    label: 'شهادة إتمام معتمدة من سُلَّم',
  },
  {
    icon: <Infinity />,
    label: 'وصول مدى الحياة للمحتوى',
  },
];

export default function PricingCard() {
  return (
    <div className="sticky top-28 rounded-xl border p-6 flex flex-col gap-6 shadow-2xl " dir="rtl">
      {/* Price */}
      <div className="text-center">
        <div className="text-4xl font-black text-primary mb-1">199 ر.س</div>
        <div className="text-gray-400 line-through text-base">299 ر.س</div>
        <div className="mt-2 text-xs text-[#1FC58E] font-semibold bg-[#1FC58E]/10 px-3 py-1 rounded-full inline-block border border-[#1FC58E]/20">
          خصم 33%
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-primary font-bold text-lg py-3 shadow rounded-lg hover:bg-primary-hover transition-colors duration-200 active:scale-95 cursor-pointer">
        اشترك الآن
      </button>

      {/* Features */}
      <div className="flex flex-col gap-4">
        <h4 className="font-semibold text-black">تتضمن هذه الدورة:</h4>
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-gray-500">
            <span className="shrink-0">{f.icon}</span>
            <span className="text-sm">{f.label}</span>
          </div>
        ))}
      </div>

      <hr className="border-[#334155]" />

      {/* Share */}
      <div className="flex justify-center">
        <button className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
          <Share2 size={16} />
          <span className="text-sm">مشاركة</span>
        </button>
      </div>
    </div>
  );
}
