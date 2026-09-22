'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  UploadCloud,
  Send,
  Loader2,
  Award,
  X,
} from 'lucide-react';

interface AssignmentSubmissionClientProps {
  assignmentId: string;
}

export function AssignmentSubmissionClient({ assignmentId }: AssignmentSubmissionClientProps) {
  const router = useRouter();

  // Simulated countdown clock (Hours: 14, Minutes: 22, Seconds: 10)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              clearInterval(timer);
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: number) => String(t).padStart(2, '0');

  // Form states
  const [fileName, setFileName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = () => {
    if (!fileName) {
      alert('يرجى إرفاق ملف الحل أولاً قبل تسليم الواجب.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('تم إرسال إجابتك بنجاح! تم حفظ الحل وتحديث حالة التسليم إلى تم التسليم.');
      router.push('/dashboard/tasks');
    }, 2000);
  };

  // Determine specific details based on assignment id (e.g. 4 is late)
  const isLate = assignmentId === '4';

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Page Header Breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold mb-2">
            <Link
              href="/dashboard/tasks"
              className="hover:text-primary transition-colors no-underline"
            >
              الواجبات
            </Link>
            <ChevronLeft size={14} className="text-gray-400" />
            <span className="text-on-surface font-bold">حل المعادلات التربيعية</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">تفاصيل الواجب</h2>
        </div>

        {/* Gamification Badge */}
        <div className="flex items-center gap-2.5 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full shadow-sm">
          <Award size={18} className="text-secondary fill-current" />
          <span className="text-xs font-bold font-sans">+50 XP</span>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 1: Details (2 cols on LTR / 2 cols on RTL) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Assignment Description Card */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-on-background mb-4">حل المعادلات التربيعية</h3>
              <p className="text-on-surface-variant text-sm font-semibold leading-relaxed">
                قم بحل التمارين من 1 إلى 10 في الصفحة 45 من الكتاب المدرسي. تأكد من إظهار جميع خطوات
                الحل بوضوح. يمكنك استخدام الطريقة الجبرية أو الرسم البياني للتحقق من إجاباتك.
              </p>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-4 bg-error-container/30 text-error-container p-4 rounded-lg border border-error-container/50">
              <Clock className="text-error w-8 h-8 shrink-0" />
              <div className="flex-grow">
                <span className="text-[10px] text-error font-bold block">تاريخ التسليم</span>
                <span className="text-sm text-error font-extrabold">
                  {isLate ? 'فات موعد التسليم' : 'غداً، 11:59 مساءً'}
                </span>
              </div>
              {!isLate && (
                <div className="text-left font-mono">
                  <span className="text-xl text-error font-black block leading-none">
                    {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
                    {formatTime(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] text-error font-semibold block text-center mt-1">
                    متبقي
                  </span>
                </div>
              )}
            </div>

            {/* Attachment files from teacher */}
            <div className="pt-6 border-t border-outline-variant">
              <h4 className="font-bold text-sm text-on-background mb-4">
                الملفات المرفقة من المعلم
              </h4>
              <div className="flex gap-4">
                <a
                  onClick={() => alert('جاري تحميل ورقة عمل المعادلات...')}
                  className="flex items-center gap-3 bg-surface-container py-3 px-4 rounded-lg hover:bg-surface-container-high transition-colors border border-outline-variant flex-1 no-underline text-right cursor-pointer"
                >
                  <FileText className="text-primary shrink-0" />
                  <div className="flex-grow">
                    <span className="text-xs font-bold text-on-background block">
                      ورقة_عمل_المعادلات.pdf
                    </span>
                    <span className="text-[10px] text-outline font-semibold block mt-0.5 font-mono">
                      2.4 MB
                    </span>
                  </div>
                  <Download size={16} className="text-outline shrink-0 mr-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Submission Area (1 col on LTR / 1 col on RTL) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 sticky top-24 space-y-6">
            <h3 className="font-bold text-base text-on-background mb-6">تسليم الواجب</h3>

            <div className="flex flex-col gap-5">
              {/* File Drop zone */}
              <div>
                <label className="text-xs font-bold text-on-background mb-2 block">
                  إرفاق ملفات الحل
                </label>
                <div className="border-2 border-dashed border-primary-container/30 bg-primary-fixed/5 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-fixed/10 transition-colors group relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="w-10 h-10 text-primary-container mb-3 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold text-primary-container mb-1">
                    اسحب وأفلت الملفات هنا
                  </span>
                  <span className="text-[10px] text-outline font-semibold">
                    أو انقر للاستعراض (PDF, JPG, PNG)
                  </span>
                </div>
              </div>

              {/* Display Uploaded File */}
              {fileName && (
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-primary font-bold truncate">
                    <FileText size={16} className="shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <button
                    onClick={() => setFileName('')}
                    className="text-red-500 hover:text-red-700 font-bold font-sans text-sm cursor-pointer bg-transparent border-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Student Notes */}
              <div>
                <label
                  className="text-xs font-bold text-on-background mb-2 block"
                  htmlFor="student_notes"
                >
                  ملاحظات للطالب (اختياري)
                </label>
                <textarea
                  id="student_notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف أي ملاحظات أو أسئلة للمعلم..."
                  rows={3}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-shadow outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={isSubmitting || !fileName}
                className="w-full bg-[#1FC58E] hover:bg-[#19A878] text-white font-bold py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="text-white" />
                    <span>{isLate ? 'تسليم متأخر' : 'تسليم الواجب'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
