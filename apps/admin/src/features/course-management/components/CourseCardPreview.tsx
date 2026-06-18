'use client';

import { User, Sparkles, Image as ImageIcon, HelpCircle } from 'lucide-react';
import Image from 'next/image';

import type { CourseCardPreviewProps } from '../types';

export function CourseCardPreview({
  title,
  thumbnailUrl,
  selectedTeacherName,
  price,
  currency,
}: CourseCardPreviewProps) {
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
      <h3 className="font-body-lg-ar text-body-lg-ar text-on-surface pb-3 border-b border-outline-variant/50 mb-5 flex items-center gap-2 font-bold">
        <Sparkles size={18} className="text-primary animate-pulse" />
        معاينة حية لبطاقة الكورس
      </h3>

      {/* Course Card Component Mock */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Preview / Placeholder */}
        <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary-container/10 to-primary/5 flex items-center justify-center group overflow-hidden border-b border-outline-variant/40">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt="Course Preview"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-outline/50">
              <ImageIcon size={48} className="stroke-[1.5]" />
              <span className="font-caption-ar text-xs">صورة الغلاف تظهر هنا</span>
            </div>
          )}

          {/* Draft Badge */}
          <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant text-[#1967D2] px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
            مسودة (Draft)
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h4 className="font-body-lg-ar font-bold text-on-surface line-clamp-2 min-h-[48px] leading-relaxed">
            {title || 'عنوان الدورة التدريبية الجديدة...'}
          </h4>

          {/* Teacher */}
          <div className="flex items-center gap-2 text-on-surface-variant font-caption-ar text-xs">
            <User size={14} className="text-primary" />
            <span>المعلم: {selectedTeacherName}</span>
          </div>

          <div className="border-t border-outline-variant/30 pt-3 flex items-center justify-between">
            {/* Rating placeholder */}
            <div className="flex items-center gap-1 text-amber-500 font-caption-ar text-xs font-semibold">
              ★ 5.0 <span className="text-outline font-normal font-sans pr-1">(جديدة)</span>
            </div>

            {/* Price */}
            <div className="font-body-md-ar font-bold text-primary-container text-sm">
              {price === 0 || price === '' ? (
                <span className="text-emerald-600">مجاني</span>
              ) : (
                `${price} ${currency}`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Helpful info tips */}
      <div className="mt-6 p-4 rounded-xl bg-primary-container/5 border border-primary-container/10 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-xs text-primary-container">
          <HelpCircle size={16} />
          نصائح للإنشاء:
        </div>
        <ul className="text-[11px] text-on-surface-variant/90 list-disc list-inside space-y-1.5 pr-1">
          <li>استخدم صور غلاف واضحة بترميز JPG أو PNG.</li>
          <li>تأكد من اختيار المعلم الصحيح المعتمد في المنصة.</li>
          <li>الدورة تحفظ فوراً كمسودة لحماية بياناتك قبل نشرها للطلاب.</li>
        </ul>
      </div>
    </div>
  );
}
