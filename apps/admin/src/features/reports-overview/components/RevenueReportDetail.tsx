'use client';

import {
  CreditCard,
  TrendingUp,
  ShoppingCart,
  Receipt,
  Search,
  Download,
  Table,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React from 'react';

export function RevenueReportDetail() {
  return (
    <div className="flex-grow p-6 lg:p-8 overflow-y-auto">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="font-h1-ar text-h1-ar text-on-surface mb-2">تقرير الإيرادات الشهرية</h2>
          <p className="font-caption-ar text-caption-ar text-on-surface-variant">
            تحليل مفصل للأداء المالي خلال الفترة المحددة
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-outline-variant rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="text-outline mr-2 text-sm" />
            <select className="bg-transparent border-none text-sm font-body-md-ar text-on-surface focus:ring-0 py-0 pr-2 pl-6 cursor-pointer">
              <option>أكتوبر 2023</option>
              <option>سبتمبر 2023</option>
              <option>أغسطس 2023</option>
              <option>الربع الثالث 2023</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-white border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors shadow-sm">
            <Download className="text-sm" />
            تصدير PDF
          </button>
          <button className="flex items-center gap-2 bg-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Table className="text-sm" />
            تصدير Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-primary-fixed/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-caption-ar text-caption-ar text-on-surface-variant">
              إجمالي الإيرادات
            </h3>
            <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="font-h2-ar text-h2-ar text-on-surface mb-2">SAR 245,000</div>
          <div className="flex items-center text-secondary text-sm gap-1">
            <TrendingUp className="text-sm" />
            <span>+12.5% من الشهر السابق</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-secondary-container/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-caption-ar text-caption-ar text-on-surface-variant">صافي الربح</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="font-h2-ar text-h2-ar text-on-surface mb-2">SAR 182,450</div>
          <div className="flex items-center text-secondary text-sm gap-1">
            <TrendingUp className="text-sm" />
            <span>+8.2% من الشهر السابق</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-tertiary-fixed/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-caption-ar text-caption-ar text-on-surface-variant">
              عدد المبيعات
            </h3>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="font-h2-ar text-h2-ar text-on-surface mb-2">1,245</div>
          <div className="flex items-center text-error text-sm gap-1">
            <TrendingUp className="text-sm rotate-180" />
            <span>-2.1% من الشهر السابق</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-surface-variant/50 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-caption-ar text-caption-ar text-on-surface-variant">
              متوسط قيمة الطلب
            </h3>
            <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="font-h2-ar text-h2-ar text-on-surface mb-2">SAR 196</div>
          <div className="flex items-center text-secondary text-sm gap-1">
            <TrendingUp className="text-sm" />
            <span>+4.3% من الشهر السابق</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] mb-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-h2-ar text-h2-ar text-on-surface">اتجاهات الإيرادات والأرباح</h3>
          <div className="flex items-center gap-4 text-sm font-caption-ar">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-on-surface-variant">الإيرادات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-on-surface-variant">صافي الربح</span>
            </div>
          </div>
        </div>
        {/* Decorative Chart Area */}
        <div className="h-80 w-full relative border-b border-l border-outline-variant/30 pb-4 pr-4">
          {/* Y-Axis Labels */}
          <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-outline font-label-en items-end pr-2 -mr-10 w-10">
            <span>300k</span>
            <span>200k</span>
            <span>100k</span>
            <span>0</span>
          </div>
          {/* X-Axis Labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-outline font-label-en pt-2 -mb-8 px-4">
            <span>1 Oct</span>
            <span>8 Oct</span>
            <span>15 Oct</span>
            <span>22 Oct</span>
            <span>29 Oct</span>
          </div>
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-4">
            <div className="w-full border-b border-dashed border-outline-variant/20 h-0" />
            <div className="w-full border-b border-dashed border-outline-variant/20 h-0" />
            <div className="w-full border-b border-dashed border-outline-variant/20 h-0" />
            <div className="w-full border-b border-dashed border-outline-variant/20 h-0" />
          </div>
          {/* SVG Chart Lines */}
          <svg
            className="absolute inset-0 w-full h-full pb-4 pr-4"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {/* Revenue Line (Primary) */}
            <path
              className="drop-shadow-sm"
              d="M 0 80 Q 10 70, 20 50 T 40 40 T 60 20 T 80 30 T 100 10"
              fill="none"
              stroke="#2446B8"
              strokeWidth="2.5"
            />
            {/* Gradient Fill under Revenue */}
            <path
              d="M 0 80 Q 10 70, 20 50 T 40 40 T 60 20 T 80 30 T 100 10 L 100 100 L 0 100 Z"
              fill="url(#gradPrimary)"
              opacity="0.1"
            />
            {/* Profit Line (Secondary) */}
            <path
              d="M 0 90 Q 15 85, 25 70 T 45 60 T 65 40 T 85 45 T 100 30"
              fill="none"
              stroke="#006c4b"
              strokeDasharray="4"
              strokeWidth="2"
            />
            {/* Data Points Primary */}
            <circle cx="20" cy="50" fill="#2446B8" r="1.5" stroke="white" strokeWidth="0.5" />
            <circle cx="40" cy="40" fill="#2446B8" r="1.5" stroke="white" strokeWidth="0.5" />
            <circle cx="60" cy="20" fill="#2446B8" r="1.5" stroke="white" strokeWidth="0.5" />
            <circle cx="80" cy="30" fill="#2446B8" r="1.5" stroke="white" strokeWidth="0.5" />
            <defs>
              <linearGradient id="gradPrimary" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#2446B8" stopOpacity="1" />
                <stop offset="100%" stopColor="#2446B8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="font-h2-ar text-h2-ar text-on-surface">التفاصيل اليومية</h3>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              className="pl-4 pr-10 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all w-48"
              placeholder="بحث في الجدول..."
              type="text"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm font-body-md-ar">
            <thead className="bg-surface-container-low text-on-surface-variant font-caption-ar border-b border-outline-variant/30">
              <tr>
                <th className="py-4 px-6 font-semibold">التاريخ</th>
                <th className="py-4 px-6 font-semibold">عدد المبيعات</th>
                <th className="py-4 px-6 font-semibold">إجمالي الإيرادات</th>
                <th className="py-4 px-6 font-semibold">صافي الربح</th>
                <th className="py-4 px-6 font-semibold">النسبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="py-4 px-6 text-on-surface">24 أكتوبر 2023</td>
                <td className="py-4 px-6 text-on-surface-variant">42</td>
                <td className="py-4 px-6 font-medium text-on-surface">SAR 8,400</td>
                <td className="py-4 px-6 text-secondary font-medium">SAR 6,250</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-secondary">
                    <TrendingUp className="text-xs" />
                    <span>4.2%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors bg-surface-container-lowest/50">
                <td className="py-4 px-6 text-on-surface">23 أكتوبر 2023</td>
                <td className="py-4 px-6 text-on-surface-variant">38</td>
                <td className="py-4 px-6 font-medium text-on-surface">SAR 7,600</td>
                <td className="py-4 px-6 text-secondary font-medium">SAR 5,800</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-secondary">
                    <TrendingUp className="text-xs" />
                    <span>1.5%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="py-4 px-6 text-on-surface">22 أكتوبر 2023</td>
                <td className="py-4 px-6 text-on-surface-variant">45</td>
                <td className="py-4 px-6 font-medium text-on-surface">SAR 9,100</td>
                <td className="py-4 px-6 text-secondary font-medium">SAR 6,900</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-error">
                    <TrendingUp className="text-xs rotate-180" />
                    <span>2.1%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors bg-surface-container-lowest/50">
                <td className="py-4 px-6 text-on-surface">21 أكتوبر 2023</td>
                <td className="py-4 px-6 text-on-surface-variant">52</td>
                <td className="py-4 px-6 font-medium text-on-surface">SAR 10,400</td>
                <td className="py-4 px-6 text-secondary font-medium">SAR 7,850</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-secondary">
                    <TrendingUp className="text-xs" />
                    <span>6.8%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="py-4 px-6 text-on-surface">20 أكتوبر 2023</td>
                <td className="py-4 px-6 text-on-surface-variant">31</td>
                <td className="py-4 px-6 font-medium text-on-surface">SAR 6,200</td>
                <td className="py-4 px-6 text-secondary font-medium">SAR 4,600</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-error">
                    <TrendingUp className="text-xs rotate-180" />
                    <span>5.4%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <span className="text-sm font-caption-ar text-on-surface-variant">
            عرض 1-5 من 30 نتيجة
          </span>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50"
              disabled
            >
              <ChevronRight className="text-sm" />
            </button>
            <button className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center font-medium text-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors text-sm">
              2
            </button>
            <button className="w-8 h-8 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors text-sm">
              3
            </button>
            <button className="w-8 h-8 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
              <ChevronLeft className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
