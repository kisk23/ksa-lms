'use client';

import { useState } from 'react';
import {
  FileText,
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DetailedSubject {
  id: string;
  name: string;
  termWork: string; // e.g. "45/50"
  examWork: string; // e.g. "50/50"
  grade: string; // e.g. "95 A+"
  percentage: number; // e.g. 95
  colorClass: string; // e.g. "text-secondary" or "text-primary" or "text-error"
  progressBarClass: string;
  icon: any;
  // Extra detail metrics for expansion
  attendance: string;
  quizzesAvg: string;
  homeworkAvg: string;
}

export function ReportsClient() {
  const [term, setTerm] = useState<'term-1' | 'term-2'>('term-1');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Subjects data
  const subjectsData: DetailedSubject[] = [
    {
      id: 'sub-1',
      name: 'الفيزياء',
      termWork: '45/50',
      examWork: '50/50',
      grade: '95 A+',
      percentage: 95,
      colorClass: 'text-secondary',
      progressBarClass: 'bg-secondary',
      icon: BookOpen,
      attendance: '98%',
      quizzesAvg: '9.5/10',
      homeworkAvg: '10/10',
    },
    {
      id: 'sub-2',
      name: 'الرياضيات',
      termWork: '48/50',
      examWork: '42/50',
      grade: '90 A',
      percentage: 90,
      colorClass: 'text-primary',
      progressBarClass: 'bg-primary',
      icon: TrendingUp,
      attendance: '95%',
      quizzesAvg: '9.0/10',
      homeworkAvg: '9.5/10',
    },
    {
      id: 'sub-3',
      name: 'الكيمياء',
      termWork: '40/50',
      examWork: '30/50',
      grade: '70 C',
      percentage: 70,
      colorClass: 'text-orange-600',
      progressBarClass: 'bg-orange-500',
      icon: Award,
      attendance: '82%',
      quizzesAvg: '7.2/10',
      homeworkAvg: '8.0/10',
    },
  ];

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    toast.loading('جاري تجهيز كشف الدرجات للتحميل...', { duration: 1500 });
    setTimeout(() => {
      setIsDownloading(false);
      toast.success('تم تحميل كشف الدرجات بنجاح بصيغة PDF!');
    }, 1600);
  };

  const toggleExpand = (id: string) => {
    setExpandedSubjectId((prev) => (prev === id ? null : id));
  };

  // GPA computation ring constants
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // GPA 3.8/4.0 corresponds to 95% progress
  const strokeOffset = circumference * (1 - 3.8 / 4.0);

  return (
    <div className="space-y-8 font-arabic text-right pb-12" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-end flex-wrap gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="text-3xl font-black text-on-background mb-1">التقارير الأكاديمية</h1>
          <p className="text-sm text-on-surface-variant font-medium">
            نظرة شاملة على أدائك ودرجاتك للفصل الدراسي الحالي.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Download size={14} />
          <span>تحميل كشف الدرجات (PDF)</span>
        </button>
      </header>

      {/* Summary Bento Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPA Bento Box */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(22,33,62,0.04)] p-6 border border-outline-variant/50 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-on-surface-variant mb-2">
              المعدل التراكمي (GPA)
            </h3>
            <div className="text-2xl font-black text-on-background">3.8 / 4.0</div>
            <div className="text-[10px] text-secondary font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>ممتاز مرتفع</span>
            </div>
          </div>

          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="#eaedff"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="#1FC58E"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-on-background">
              A
            </div>
          </div>
        </div>

        {/* Attendance Bento Box */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(22,33,62,0.04)] p-6 border border-outline-variant/50 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-on-surface-variant mb-2">نسبة الحضور الكلية</h3>
            <div className="text-2xl font-black text-on-background">92%</div>
            <div className="text-[10px] text-secondary font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>+2% عن الشهر الماضي</span>
            </div>
          </div>

          <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center shrink-0 border border-primary/10">
            <Calendar size={28} className="text-primary-container" />
          </div>
        </div>

        {/* Rank Bento Box */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(22,33,62,0.04)] p-6 border border-outline-variant/50 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-on-surface-variant mb-2">الترتيب على الدفعة</h3>
            <div className="text-2xl font-black text-on-background font-sans">المركز الخامس</div>
            <div className="text-[10px] text-on-surface-variant font-semibold mt-2">
              من أصل 120 طالب وطالبة
            </div>
          </div>

          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-500">
            <Award size={28} className="fill-amber-500/10" />
          </div>
        </div>
      </section>

      {/* Detailed Table Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-on-background px-1">تفاصيل المواد</h2>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(22,33,62,0.04)] border border-outline-variant/60 overflow-hidden">
          {/* Header Row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 text-xs font-bold text-on-surface-variant">
            <div className="col-span-3">المادة</div>
            <div className="col-span-2 text-center">الأعمال الدورية</div>
            <div className="col-span-2 text-center">الاختبار النهائي</div>
            <div className="col-span-2 text-center">التقدير</div>
            <div className="col-span-3">مؤشر الأداء</div>
          </div>

          {/* Subjects rows list */}
          <div className="divide-y divide-outline-variant/30">
            {subjectsData.map((sub) => {
              const IconComp = sub.icon;
              const isExpanded = expandedSubjectId === sub.id;

              return (
                <div key={sub.id} className="transition-all">
                  {/* Grid row */}
                  <div
                    onClick={() => toggleExpand(sub.id)}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-surface-bright/70 cursor-pointer transition-colors"
                  >
                    <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/5 border border-primary/10 flex items-center justify-center text-primary-container shrink-0">
                          <IconComp size={16} />
                        </div>
                        <span className="text-xs font-bold text-on-background">{sub.name}</span>
                      </div>
                      <span className="sm:hidden text-outline-variant">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center text-xs font-semibold text-on-surface">
                      <span className="sm:hidden text-on-surface-variant font-medium">
                        الأعمال الدورية:
                      </span>
                      <span>{sub.termWork}</span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center text-xs font-semibold text-on-surface">
                      <span className="sm:hidden text-on-surface-variant font-medium">
                        الاختبار النهائي:
                      </span>
                      <span>{sub.examWork}</span>
                    </div>

                    <div
                      className={`col-span-1 sm:col-span-2 flex justify-between sm:justify-center text-xs font-black ${sub.colorClass}`}
                    >
                      <span className="sm:hidden text-on-surface-variant font-medium">
                        التقدير الحالي:
                      </span>
                      <span>{sub.grade}</span>
                    </div>

                    <div className="col-span-1 sm:col-span-3 flex flex-col gap-1 w-full">
                      <span className="sm:hidden text-on-surface-variant text-[10px] font-bold mb-1">
                        مؤشر الأداء الدراسي:
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sub.progressBarClass}`}
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                        <span className="hidden sm:inline text-xs text-outline-variant">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail box */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 text-xs font-medium space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-outline-variant/20 shadow-xs">
                          <span className="text-on-surface-variant font-semibold">
                            الحضور والغياب بالمادة
                          </span>
                          <span className="font-bold text-on-background">{sub.attendance}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-outline-variant/20 shadow-xs">
                          <span className="text-on-surface-variant font-semibold">
                            متوسط درجات الكويزات
                          </span>
                          <span className="font-bold text-on-background">{sub.quizzesAvg}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-outline-variant/20 shadow-xs">
                          <span className="text-on-surface-variant font-semibold">
                            متوسط تسليم الواجبات
                          </span>
                          <span className="font-bold text-on-background">{sub.homeworkAvg}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5 p-3 bg-primary-container/5 rounded-lg border border-primary-container/10">
                        <Info size={14} className="text-primary mt-0.5" />
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">
                          ملاحظة: يتم تحديث التقرير بعد انتهاء كل وحدة دراسية. لمراجعة الدرجات
                          التفصيلية لكل اختبار تفضل بزيارة صفحة &quot;الاختبارات&quot;.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
