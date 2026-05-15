'use client';

import { History, Smartphone, Globe } from 'lucide-react';

export function RegistrationsLiveFeed() {
  const MOCK_FEED = [
    {
      id: 1,
      initial: 'أ.م',
      name: 'أحمد محمد',
      role: 'طالب',
      roleClass: 'bg-[#eff6ff] text-[#2446b8] border-primary/20',
      region: 'الرياض',
      source: 'تطبيق الجوال',
      icon: Smartphone,
      time: 'منذ 5 دقائق',
    },
    {
      id: 2,
      initial: 'س.ع',
      name: 'سارة عبدالله',
      role: 'معلم',
      roleClass: 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20',
      region: 'جدة',
      source: 'البوابة الإلكترونية',
      icon: Globe,
      time: 'منذ 12 دقيقة',
    },
    {
      id: 3,
      initial: 'خ.س',
      name: 'خالد سعد',
      role: 'ولي أمر',
      roleClass: 'bg-secondary/10 text-secondary border-secondary/20',
      region: 'الدمام',
      source: 'البوابة الإلكترونية',
      icon: Globe,
      time: 'منذ 28 دقيقة',
    },
    {
      id: 4,
      initial: 'ف.ن',
      name: 'فاطمة ناصر',
      role: 'طالب',
      roleClass: 'bg-[#eff6ff] text-[#2446b8] border-primary/20',
      region: 'مكة',
      source: 'تطبيق الجوال',
      icon: Smartphone,
      time: 'منذ 45 دقيقة',
    },
    {
      id: 5,
      initial: 'ع.ط',
      name: 'عمر طارق',
      role: 'طالب',
      roleClass: 'bg-[#eff6ff] text-[#2446b8] border-primary/20',
      region: 'الرياض',
      source: 'تطبيق الجوال',
      icon: Smartphone,
      time: 'منذ ساعة',
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex flex-col h-full relative overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2446b8]">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-[#1E293B]">أحدث التسجيلات</h3>
        </div>
        <a className="font-body-md-ar text-sm font-bold text-[#2446b8] hover:underline" href="#">
          عرض الكل
        </a>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-50 text-[#64748B]">
              <th className="py-4 px-8 font-semibold text-xs uppercase tracking-wider">
                اسم المستخدم
              </th>
              <th className="py-4 px-8 font-semibold text-xs uppercase tracking-wider">الدور</th>
              <th className="py-4 px-8 font-semibold text-xs uppercase tracking-wider">المنطقة</th>
              <th className="py-4 px-8 font-semibold text-xs uppercase tracking-wider">المصدر</th>
              <th className="py-4 px-8 font-semibold text-xs uppercase tracking-wider">الوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-body-md-ar text-sm text-[#1E293B]">
            {MOCK_FEED.map((feed) => (
              <tr key={feed.id} className="hover:bg-[#eff6ff] transition-colors group">
                <td className="py-5 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high/50 flex items-center justify-center text-[#64748B] font-bold text-xs">
                      {feed.initial}
                    </div>
                    <span className="font-bold">{feed.name}</span>
                  </div>
                </td>
                <td className="py-5 px-8">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${feed.roleClass}`}
                  >
                    {feed.role}
                  </span>
                </td>
                <td className="py-5 px-8 text-[#64748B] font-medium">{feed.region}</td>
                <td className="py-5 px-8">
                  <div className="flex items-center gap-2 text-[#64748B] font-medium">
                    <feed.icon className="w-4 h-4" />
                    <span>{feed.source}</span>
                  </div>
                </td>
                <td className="py-5 px-8 text-[#64748B]/80 font-medium">{feed.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
