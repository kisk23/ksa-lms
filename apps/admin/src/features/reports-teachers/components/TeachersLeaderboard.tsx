import { Eye, MessageSquare, Gift } from 'lucide-react';
import Image from 'next/image';

import type { Teacher } from '../types';

interface TeachersLeaderboardProps {
  teachers: Teacher[];
}

const StarFilled = () => (
  <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StarHalf = () => (
  <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77v-15.77z" />
  </svg>
);

const StarEmpty = () => (
  <svg className="w-4 h-4 stroke-yellow-400 fill-none" viewBox="0 0 24 24" strokeWidth={2}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export function TeachersLeaderboard({ teachers }: TeachersLeaderboardProps) {
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400 text-white';
      case 2:
        return 'bg-slate-300 text-white';
      case 3:
        return 'bg-amber-600 text-white';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilled key={`full-${i}`} />);
    }
    if (hasHalf) {
      stars.push(<StarHalf key="half" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarEmpty key={`empty-${i}`} />);
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-h2-ar text-h2-ar text-[#0F172A]">لوحة الصدارة (Leaderboard)</h2>
        <button className="text-primary-container font-body-md-ar hover:underline">عرض الكل</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[#64748B] font-caption-ar text-sm">
              <th className="pb-3 font-medium px-6 py-4 text-right">المعلم</th>
              <th className="pb-3 font-medium px-6 py-4 text-right">عدد الطلاب</th>
              <th className="pb-3 font-medium px-6 py-4 text-right">متوسط التقييم</th>
              <th className="pb-3 font-medium px-6 py-4 text-right">إجمالي الأرباح</th>
              <th className="pb-3 font-medium px-6 py-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        alt={teacher.name}
                        src={teacher.image}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                        unoptimized
                      />
                      <div
                        className={`absolute -top-1 -right-1 w-5 h-5 ${getRankBadgeColor(
                          teacher.rank,
                        )} rounded-full flex items-center justify-center border-2 border-white shadow-sm`}
                      >
                        <span className="text-[10px] font-bold">{teacher.rank}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-body-md-ar font-medium text-[#0F172A] group-hover:text-primary-container transition-colors">
                        {teacher.name}
                      </div>
                      <div className="font-caption-ar text-sm text-[#64748B]">
                        {teacher.subjectAr}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-label-en text-label-en text-[#0F172A]">
                  {teacher.studentCount.toLocaleString('ar-SA')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{renderStars(teacher.rating)}</div>
                    <span className="font-label-en text-label-en text-[#0F172A] ml-2">
                      {teacher.rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-label-en text-label-en text-secondary font-semibold">
                  SAR {teacher.totalEarnings.toLocaleString('ar-SA')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary-container hover:bg-primary-container hover:text-white transition-colors"
                      title="عرض الملف الشخصي"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors"
                      title="إرسال رسالة"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors"
                      title="إرسال مكافأة"
                    >
                      <Gift className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
