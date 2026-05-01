import { Users } from 'lucide-react';

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function CourseInfo() {
  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 bg-primary/15 text-primary rounded-full text-sm font-semibold border border-[#2446B8]/20">
          فيزياء
        </span>
        <span className="px-3 py-1 bg-[#1FC58E]/10 text-[#1FC58E] rounded-full text-sm font-semibold border border-[#1FC58E]/20">
          المرحلة الثانوية
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-black leading-tight">
        الفيزياء المتقدمة: ميكانيكا الكم والديناميكا
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-500 leading-relaxed">
        استكشف القوانين التي تحكم الكون من خلال هذا الكورس الشامل الذي يغطي المفاهيم الأساسية
        والمتقدمة في الفيزياء بطريقة تفاعلية ومبسطة.
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-6 mt-3">
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ0ZQ4Uesc_Q19F2StqTmzu8QB1hL71hZ9N0hPQ0EEUI6PHEWg8Pq2Wrwt3IlOZuxW_JAzZW13JTZbygdwzaJwgBuh3LZOnKD3wFZhXu1qrdU0M0fCK8hGr7siYieFO0td42jy7soToJqzgU45Q1kOfM2Hva_ko9QzdPPMjxjYLUgiQ5o-SidZyY8_hk728nVuVGMnez6inHnL0Y_dnTGThkO8SGZ0U2jrGTlgsNQ4FXYJjAWN5Qq5Unu6oMx0aeFicOUGY6bP4cpW"
            alt="Instructor"
            className="w-9 h-9 rounded-full object-cover border-2 border-[#334155]"
          />
          <span className="font-semibold text-black/80 text-sm">أ. أحمد عبدالله</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-amber-400">
            <StarIcon />
          </span>
          <span className="font-semibold text-black/80 text-sm">4.8</span>
          <span className="text-gray-500 text-xs">(124 تقييم)</span>
        </div>

        {/* Students */}
        <div className="flex items-center gap-1 text-gray-500">
          <Users />
          <span className="text-sm">1,540 طالب مسجل</span>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* About section */}
      <div>
        <h2 className="text-2xl font-bold text-black/80 mb-3">عن الدورة</h2>
        <p className="text-gray-500 leading-relaxed">
          صُمم هذا الكورس خصيصاً لطلاب المرحلة الثانوية لتبسيط مفاهيم الفيزياء المعقدة. سنبدأ
          بأساسيات الحركة والقوة، وننتقل تدريجياً إلى مواضيع أكثر تعقيداً مثل الموجات،
          الكهرومغناطيسية، ومقدمة في ميكانيكا الكم. يعتمد الكورس على الأمثلة العملية والتجارب
          الافتراضية لضمان الفهم العميق بدلاً من الحفظ.
        </p>
      </div>
    </div>
  );
}
