'use client';

import { apiClient } from '@shared/lib/api-client';
import {
  CreditCard,
  ShoppingCart,
  Receipt,
  Search,
  Download,
  Table,
  Calendar,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import type { DailyRevenue, RevenueSummary } from '../types';

const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export function RevenueReportDetail() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [dailyData, setDailyData] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch daily revenue
        const dailyRes = await apiClient.get<DailyRevenue[]>(
          `/payments/revenue/daily?year=${selectedYear}&month=${selectedMonth}`,
        );
        setDailyData(dailyRes);

        // Fetch summary
        const startOfMonth = new Date(Date.UTC(selectedYear, selectedMonth, 1));
        const endOfMonth = new Date(Date.UTC(selectedYear, selectedMonth + 1, 1) - 1);
        const summaryRes = await apiClient.get<RevenueSummary>(
          `/payments/summary?dateFrom=${startOfMonth.toISOString()}&dateTo=${endOfMonth.toISOString()}`,
        );
        setSummary(summaryRes);
      } catch (err) {
        console.error('Failed to fetch revenue data', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedMonth, selectedYear]);

  // Generate SVG paths
  const overallMax = Math.max(...dailyData.map((d) => Math.max(d.revenue, d.netProfit)), 1);
  const stepX = dailyData.length > 1 ? 100 / (dailyData.length - 1) : 100;

  const revenuePoints = dailyData.map(
    (d, i) => `${i * stepX} ${100 - (d.revenue / overallMax) * 100}`,
  );
  const profitPoints = dailyData.map(
    (d, i) => `${i * stepX} ${100 - (d.netProfit / overallMax) * 100}`,
  );

  const revenuePath = revenuePoints.length > 0 ? `M ${revenuePoints.join(' L ')}` : '';
  const profitPath = profitPoints.length > 0 ? `M ${profitPoints.join(' L ')}` : '';
  const areaPath = revenuePoints.length > 0 ? `${revenuePath} L 100 100 L 0 100 Z` : '';

  const avgOrderValue = summary?.successfulTransactions
    ? summary.totalRevenue / summary.successfulTransactions
    : 0;

  return (
    <div className="flex-grow p-0 overflow-y-auto">
      {/* Page Header & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="space-y-4">
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-[#2446b8] hover:text-[#1e40af] transition-colors font-medium text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة للتقارير
          </Link>
          <div>
            <h1 className="text-5xl font-bold text-[#1E293B]">تقرير الإيرادات الشهرية</h1>
            <p className="text-xl text-[#64748B] mt-2 max-w-2xl leading-relaxed">
              تحليل مفصل للأداء المالي خلال الفترة المحددة
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-slate-100 rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="text-[#2446b8] mr-2 text-sm" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent border-none text-sm font-body-md-ar text-[#0F172A] focus:ring-0 py-0 pr-2 pl-6 cursor-pointer"
            >
              {ARABIC_MONTHS.map((monthName, idx) => (
                <option key={idx} value={idx}>
                  {monthName} {selectedYear}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-100 text-[#0F172A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors shadow-sm">
            <Download className="text-sm" />
            تصدير PDF
          </button>
          <button className="flex items-center gap-2 bg-[#2446b8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Table className="text-sm" />
            تصدير Excel
          </button>
        </div>
      </div>

      {loading && (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#2446b8]" />
        </div>
      )}

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">{error}</div>}

      {!loading && !error && summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#eff6ff]/20 rounded-full blur-xl" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">إجمالي الإيرادات</h3>
                <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-primary flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-[#0F172A] mb-2">
                {summary.totalRevenue.toLocaleString('ar-SA')} ر.س
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#ecfdf5]/20 rounded-full blur-xl" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">صافي الربح</h3>
                <div className="w-10 h-10 rounded-full bg-[#ecfdf5] text-on-secondary-container flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-[#0F172A] mb-2">
                {summary.netProfit.toLocaleString('ar-SA')} ر.س
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#fff7ed]/20 rounded-full blur-xl" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">عدد المبيعات</h3>
                <div className="w-10 h-10 rounded-full bg-[#fff7ed] text-tertiary flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-[#0F172A] mb-2">
                {summary.successfulTransactions.toLocaleString('ar-SA')}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] relative overflow-hidden">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#f8fafc]/50 rounded-full blur-xl" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">متوسط قيمة الطلب</h3>
                <div className="w-10 h-10 rounded-full bg-[#f8fafc] text-[#64748B] flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-[#0F172A] mb-2">
                {avgOrderValue.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ر.س
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] mb-8 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-4xl font-semibold text-[#0F172A]">اتجاهات الإيرادات والأرباح</h3>
              <div className="flex items-center gap-4 text-sm font-caption-ar">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[#64748B]">الإيرادات</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-[#64748B]">صافي الربح</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full relative border-b border-l border-slate-100/30 pb-4 pr-4">
              <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-[#2446b8] font-label-en items-end pr-2 -mr-12 w-12">
                <span>{overallMax.toLocaleString('ar-SA', { notation: 'compact' })}</span>
                <span>{(overallMax * 0.75).toLocaleString('ar-SA', { notation: 'compact' })}</span>
                <span>{(overallMax * 0.5).toLocaleString('ar-SA', { notation: 'compact' })}</span>
                <span>{(overallMax * 0.25).toLocaleString('ar-SA', { notation: 'compact' })}</span>
                <span>0</span>
              </div>

              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-[#2446b8] font-label-en pt-2 -mb-8 px-4">
                <span>1 {ARABIC_MONTHS[selectedMonth]}</span>
                <span>7 {ARABIC_MONTHS[selectedMonth]}</span>
                <span>14 {ARABIC_MONTHS[selectedMonth]}</span>
                <span>21 {ARABIC_MONTHS[selectedMonth]}</span>
                <span>
                  {dailyData.length} {ARABIC_MONTHS[selectedMonth]}
                </span>
              </div>

              <div className="absolute inset-0 flex flex-col justify-between pb-4">
                <div className="w-full border-b border-dashed border-slate-100/20 h-0" />
                <div className="w-full border-b border-dashed border-slate-100/20 h-0" />
                <div className="w-full border-b border-dashed border-slate-100/20 h-0" />
                <div className="w-full border-b border-dashed border-slate-100/20 h-0" />
                <div className="w-full border-b border-dashed border-slate-100/20 h-0" />
              </div>

              <svg
                className="absolute inset-0 w-full h-full pb-4 pr-4 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d={revenuePath}
                  fill="none"
                  stroke="#2446B8"
                  strokeWidth="1.5"
                  className="drop-shadow-sm"
                />
                <path d={areaPath} fill="url(#gradPrimary)" opacity="0.15" />
                <path
                  d={profitPath}
                  fill="none"
                  stroke="#006c4b"
                  strokeWidth="1.5"
                  strokeDasharray="3"
                />

                {dailyData.map((d, i) => {
                  if (i % 7 === 0 || i === dailyData.length - 1) {
                    return (
                      <g key={i}>
                        <circle
                          cx={i * stepX}
                          cy={100 - (d.revenue / overallMax) * 100}
                          fill="#2446B8"
                          r="1.5"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                        <circle
                          cx={i * stepX}
                          cy={100 - (d.netProfit / overallMax) * 100}
                          fill="#006c4b"
                          r="1.5"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </g>
                    );
                  }
                  return null;
                })}

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
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden">
            <div className="p-6 border-b border-slate-100/30 flex justify-between items-center">
              <h3 className="text-4xl font-semibold text-[#0F172A]">التفاصيل اليومية</h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-1.5 bg-surface-container-lowest border border-slate-100 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all w-48"
                  placeholder="بحث في الجدول..."
                  type="text"
                />
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-right text-sm font-body-md-ar">
                <thead className="bg-surface-container-low text-[#64748B] font-caption-ar border-b border-slate-100/30 sticky top-0">
                  <tr>
                    <th className="py-4 px-6 font-semibold">التاريخ</th>
                    <th className="py-4 px-6 font-semibold">عدد المبيعات</th>
                    <th className="py-4 px-6 font-semibold">إجمالي الإيرادات</th>
                    <th className="py-4 px-6 font-semibold">صافي الربح</th>
                    <th className="py-4 px-6 font-semibold">النسبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {[...dailyData]
                    .reverse()
                    .filter(
                      (day) =>
                        searchQuery === '' ||
                        day.date.includes(searchQuery) ||
                        day.revenue.toString().includes(searchQuery) ||
                        day.netProfit.toString().includes(searchQuery),
                    )
                    .map((day, i) => (
                      <tr
                        key={day.day}
                        className={`hover:bg-surface-container-lowest transition-colors ${i % 2 === 0 ? '' : 'bg-surface-container-lowest/50'}`}
                      >
                        <td className="py-4 px-6 text-[#0F172A]">{day.date}</td>
                        <td className="py-4 px-6 text-[#64748B]">{day.sales}</td>
                        <td className="py-4 px-6 font-medium text-[#0F172A]">
                          {day.revenue.toLocaleString('ar-SA')} ر.س
                        </td>
                        <td className="py-4 px-6 text-secondary font-medium">
                          {day.netProfit.toLocaleString('ar-SA')} ر.س
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-secondary">
                            <span>{day.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
