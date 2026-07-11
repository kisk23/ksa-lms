'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  Calendar,
  CheckCircle,
  FileText,
  Download,
  Eye,
  MessageSquare,
  Award,
  ArrowRight,
  Maximize2,
  X,
} from 'lucide-react';

interface GradedAssignmentClientProps {
  assignmentId: string;
}

export function GradedAssignmentClient({ assignmentId }: GradedAssignmentClientProps) {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Circular progress properties
  const grade = 95;
  const maxGrade = 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // 282.7
  const strokeDashoffset = circumference - (grade / maxGrade) * circumference;

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
        <Link href="/dashboard/tasks" className="hover:text-primary transition-colors no-underline">
          الواجبات
        </Link>
        <ChevronLeft size={14} className="text-gray-400" />
        <span className="text-on-surface font-bold">حل المعادلات التربيعية</span>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <span className="bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1 rounded-full">
              رياضيات
            </span>
            <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle size={12} className="text-secondary" />
              <span>تم التقييم</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-2">
            واجب: حل المعادلات التربيعية
          </h1>
          <p className="text-on-surface-variant text-xs font-medium flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            <span>تم التسليم: ١٢ أكتوبر ٢٠٢٣، ٠٩:٤٥ صباحاً</span>
          </p>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grade & Teacher Feedback (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Circular Grade Ring */}
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/20 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary-container"></div>
            <h3 className="font-bold text-sm text-on-surface mb-6">النتيجة النهائية</h3>

            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="45"
                  stroke="rgba(234,237,255,1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="45"
                  stroke="#006C4B"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="8"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-sans font-bold text-secondary">{grade}</span>
                <span className="text-xs text-on-surface-variant border-t border-outline-variant/30 pt-1.5 w-14 text-center font-mono mt-1">
                  {maxGrade}
                </span>
              </div>
            </div>
            <p className="text-sm font-extrabold mt-6 text-secondary">ممتاز جداً!</p>
          </div>

          {/* Gamification Streak Badge */}
          <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFECB3] rounded-xl shadow-sm border border-[#FFE082] p-5 flex items-start gap-4 transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-white p-3 rounded-full shadow-inner shrink-0 text-[#FFB300]">
              <Award size={24} className="fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FF8F00] mb-1">
                سلّمت كل واجباتك في الوقت! 🎯
              </h4>
              <p className="text-[11px] text-[#FF8F00]/80 leading-relaxed font-semibold">
                لقد حافظت على سلسلة تسليم الواجبات لـ 4 أسابيع متتالية.
              </p>
            </div>
          </div>

          {/* Instructor Feedback Bubble */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 p-6 flex-1">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-outline-variant/20">
              <MessageSquare className="text-primary bg-surface-container-low p-2 w-9 h-9 rounded-lg" />
              <h3 className="font-bold text-sm text-on-surface">ملاحظات المعلم</h3>
            </div>
            <div className="flex gap-4">
              <Image
                alt="صورة المعلم"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrWbSQCUPurexXeSyKDwR5AfbZgFVaxnqQzxL3clSRzUDX1yjY5_D9fp2s1EGnts4t8ekW7rxWCU2MfOUCMKbQIcPcwEkxxYUOubiolq0HuyE9rfX8D10V3Hzak7nGD7nnAfOMKUmaoGfICvM9yjpHPtY2Jsao2ilGZHjkvvax4dDmt8D8ky2gMlWWvWnEMg3SylOIUc1gKhB1liqbyx2DgRaEWI9VBIX5BkF9t99tgaRyI2De22xTIBgnBtP-vNKbKUCHH6e3r6Rl"
              />
              <div className="bg-surface-container-low p-4 rounded-xl rounded-tr-none text-on-surface text-xs font-semibold leading-relaxed w-full border border-outline-variant/10 relative">
                <span className="absolute top-0 right-[-8px] border-[8px] border-transparent border-l-surface-container-low border-t-surface-container-low"></span>
                &quot;عمل ممتاز يا أحمد! لقد أظهرت فهماً عميقاً لخطوات حل المعادلات التربيعية
                باستخدام القانون العام. لاحظت دقة في التعويض وإيجاد الجذور.
                <br />
                <br />
                ملاحظة بسيطة: في السؤال الثالث، انتبه لإشارة الحد الثابت قبل التعويض. بخلاف ذلك، عمل
                رائع.&quot;
                <p className="text-on-surface-variant font-medium text-[10px] mt-4 text-left block">
                  أ. خالد عبدالله
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Files Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Instructions Accordion */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div
              onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
              className="bg-surface-container p-4 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5 text-on-surface font-bold text-sm">
                <FileText size={18} className="text-primary" />
                <span>تفاصيل الواجب الأصلي</span>
              </div>
              <ChevronLeft
                size={18}
                className={`text-on-surface-variant transition-transform duration-300
                  ${isInstructionsOpen ? 'transform -rotate-90' : ''}
                `}
              />
            </div>
            {isInstructionsOpen && (
              <div className="p-6 text-on-surface text-xs font-semibold border-t border-outline-variant/20 bg-surface-bright space-y-4">
                <p>
                  قم بحل المعادلات التربيعية التالية باستخدام القانون العام، موضحاً خطوات الحل
                  بالتفصيل:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-on-surface-variant font-mono pr-2">
                  <li className="text-right" dir="ltr">
                    2x² - 5x + 3 = 0
                  </li>
                  <li className="text-right" dir="ltr">
                    x² + 4x - 12 = 0
                  </li>
                  <li className="text-right" dir="ltr">
                    3x² - 7x - 6 = 0
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Submitted File Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <span>الملفات المسلّمة</span>
              </h3>
              <button
                onClick={() => alert('جاري تحميل كافة ملفات الواجب...')}
                className="flex items-center gap-1.5 text-primary text-xs font-bold hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>تحميل الكل</span>
              </button>
            </div>

            {/* Document Card Frame */}
            <div className="relative rounded-xl overflow-hidden group border border-outline-variant/30">
              {/* Card Canvas Preview */}
              <div className="h-64 w-full bg-slate-100 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwdjFINHoiIGZpbGw9IiNjYmRkZTMiLz48cGF0aCBkPSJNMCAyMGg0MHYxSDB6IiBmaWxsPSIjY2JkZGUzIi8+PHBhdGggZD0iTTAgMzBoNDB2MUgweiIgZmlsbD0iI2NiZGRlMyIvPjwvc3ZnPg==')]"></div>
                <div className="bg-white shadow-md p-6 w-3/4 h-full rounded border border-slate-200 transform group-hover:scale-[1.02] transition-transform duration-300 flex flex-col relative z-10">
                  <div className="h-3 bg-slate-200 w-1/3 mb-4 rounded"></div>
                  <div className="h-2 bg-slate-100 w-full mb-2 rounded"></div>
                  <div className="h-2 bg-slate-100 w-5/6 mb-2 rounded"></div>
                  <div className="h-2 bg-slate-100 w-4/6 mb-6 rounded"></div>
                  <div className="flex justify-center mt-auto">
                    <div className="w-14 h-14 border-4 border-error/20 rounded-full flex items-center justify-center relative select-none">
                      <span className="text-error font-black font-sans transform -rotate-12 absolute text-lg">
                        {grade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Glassmorphic Hover Overlay */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="bg-primary text-white px-6 py-3 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                  >
                    <Eye size={16} className="text-white" />
                    <span className="text-white">عرض بملء الشاشة</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Detail */}
              <div className="bg-surface p-4 flex items-center justify-between border-t border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-error-container text-on-error-container rounded flex items-center justify-center font-sans font-bold text-xs">
                    PDF
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-on-surface">حل_المعادلات_أحمد_محمد.pdf</p>
                    <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                      2.4 MB • تم الرفع بواسطة الطالب
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert('جاري تحميل ملف: حل_المعادلات_أحمد_محمد.pdf')}
                  className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom actions bar */}
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/20">
            <Link
              href="/dashboard/tasks"
              className="px-6 py-2.5 border-2 border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-colors no-underline hover:no-underline"
            >
              العودة للواجبات
            </Link>
            <button
              onClick={() => alert('جاري توجيهك إلى المحتوى التعليمي التالي...')}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
            >
              الدرس التالي
            </button>
          </div>
        </div>
      </div>

      {/* Screen Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-variant max-w-3xl w-full overflow-hidden text-right p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-on-surface">
                معاينة: حل_المعادلات_أحمد_محمد.pdf
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {/* Fake PDF rendering sheet */}
            <div
              className="bg-slate-50 border border-outline-variant/40 rounded-lg p-10 h-[50vh] overflow-y-auto space-y-6 font-mono text-xs leading-relaxed text-left"
              dir="ltr"
            >
              <div className="font-bold text-center border-b pb-4 mb-4 text-on-surface">
                حل المعادلة التربيعية - الطالب: أحمد محمد
              </div>
              <div>
                <p className="font-bold text-slate-800">1) 2x² - 5x + 3 = 0</p>
                <p className="text-slate-600 pl-4">a = 2, b = -5, c = 3</p>
                <p className="text-slate-600 pl-4">x = [-b ± √(b² - 4ac)] / 2a</p>
                <p className="text-slate-600 pl-4">x = [5 ± √(25 - 24)] / 4 = [5 ± 1] / 4</p>
                <p className="font-bold text-secondary pl-4">x₁ = 1.5 , x₂ = 1 (صحيح)</p>
              </div>
              <div className="pt-4">
                <p className="font-bold text-slate-800">2) x² + 4x - 12 = 0</p>
                <p className="text-slate-600 pl-4">a = 1, b = 4, c = -12</p>
                <p className="text-slate-600 pl-4">x = [-4 ± √(16 - 4(1)(-12))] / 2</p>
                <p className="text-slate-600 pl-4">x = [-4 ± √(16 + 48)] / 2 = [-4 ± 8] / 2</p>
                <p className="font-bold text-secondary pl-4">x₁ = 2 , x₂ = -6 (صحيح)</p>
              </div>
              <div className="pt-4 border-t border-dashed">
                <p className="font-bold text-slate-800">3) 3x² - 7x - 6 = 0</p>
                <p className="text-slate-600 pl-4">
                  a = 3, b = -7, c = 6 (خطأ بسيط في الإشارة - الحد الثابت هو -6)
                </p>
                <p className="text-slate-600 pl-4">x = [7 ± √(49 - 4(3)(-6))] / 6</p>
                <p className="font-bold text-amber-600 pl-4">
                  التعويض: 95/100 (تم تصحيح الإشارة بواسطة المعلم)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
