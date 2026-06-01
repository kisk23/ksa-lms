import Image from 'next/image';
import { GraduationCap } from 'lucide-react';

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function InstructorProfile() {
  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold text-black/80 mb-3">المحاضر</h2>
      <div className="flex flex-col sm:flex-row gap-6 p-6 shadow border-2 rounded-xl">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzkrLWtdb6zoQ2Y3j0fTR7Obo6mq3_1xKnTSiukqMvc1DSgauX5stk22UmWaFS-N5chi9GHB1bSiQXB3IyF_RqnaSYLSv83gna-QkbMp6fqAJg6aGOGe8P1K1Fkd4k93Hjf-E3lp0xqD6BKaDKwMEQGeANkcGmmeB10DwuWxm2d-HcoppLjmL1gMxzkoXKUuuqKLltNsR77ysMs6RBlDar4nQFy2OSA4tDiCeMXWcY_gSbeygHzDlH2UuslbpNCcih2_kUlfsOFTAf"
          alt="Instructor"
          width={96}
          height={96}
          className="rounded-full object-cover border-4 border-[#334155] shrink-0"
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-black/80">أ. أحمد عبدالله</h3>
          <p className="text-sm text-primary/70 font-semibold">
            أستاذ الفيزياء المتقدمة - جامعة الملك سعود
          </p>
          <div className="flex items-center gap-5 mt-1">
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-amber-400">
                <StarIcon />
              </span>
              <span className="text-xs">4.9 تقييم المعلم</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <GraduationCap size={16} strokeWidth={2} />
              <span className="text-xs">12 دورة</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mt-1">
            خبرة تزيد عن 15 عاماً في تدريس الفيزياء للطلاب في مختلف المراحل. شغوف بتبسيط العلوم
            وربطها بالواقع لإنشاء جيل مفكر ومبتكر.
          </p>
        </div>
      </div>
    </div>
  );
}
