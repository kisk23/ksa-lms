import {
  BookOpen,
  User,
  DollarSign,
  Globe,
  Tag,
  Image as ImageIcon,
  Video,
  FileText,
  AlertCircle,
} from 'lucide-react';
import React from 'react';

import {
  inputContainerStyles,
  inputStyles,
  textareaStyles,
  selectStyles,
  iconStyles,
} from '../styles';
import type { CourseFormFieldsProps } from '../types';

export function CourseFormFields({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  currency,
  setCurrency,
  teacherUserId,
  setTeacherUserId,
  thumbnailUrl,
  setThumbnailUrl,
  promoVideoUrl,
  setPromoVideoUrl,
  promoVideoProvider,
  setPromoVideoProvider,
  category,
  setCategory,
  teachers,
  isLoadingTeachers,
  currentUser,
  headerRight,
}: CourseFormFieldsProps) {
  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-4 gap-3">
          <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container flex items-center gap-2 font-bold m-0">
            <BookOpen size={20} />
            البيانات الأساسية للدورة
          </h3>
          {headerRight && <div className="flex items-center">{headerRight}</div>}
        </div>

        <div className="space-y-2 mt-4">
          <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
            عنوان الدورة <span className="text-[#ef4444]">*</span>
          </label>
          <div className={inputContainerStyles}>
            <BookOpen size={20} className={iconStyles} />
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: أساسيات البرمجة بلغة بايثون"
              minLength={5}
              maxLength={255}
              className={inputStyles}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant/70 pr-1">
            عنوان الدورة يجب أن لا يقل عن 5 أحرف.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
            المعلم المسؤول <span className="text-[#ef4444]">*</span>
          </label>
          <div className={inputContainerStyles}>
            <User size={20} className={iconStyles} />
            <select
              required
              value={teacherUserId}
              onChange={(e) => setTeacherUserId(e.target.value)}
              className={selectStyles}
              disabled={
                isLoadingTeachers || currentUser?.role === 'TEACHER' || teachers.length === 0
              }
            >
              {isLoadingTeachers ? (
                <option disabled value="">
                  جاري تحميل المعلمين...
                </option>
              ) : teachers.length === 0 ? (
                <option disabled value="">
                  حدث خطأ في تحميل المعلمين أو لا يوجد معلمين
                </option>
              ) : (
                teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </option>
                ))
              )}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-outline">
              ▼
            </div>
          </div>
          {!isLoadingTeachers && teachers.length === 0 && currentUser?.role !== 'TEACHER' && (
            <p className="text-xs text-error font-medium pr-1 flex items-center gap-1">
              <AlertCircle size={14} />
              تعذر جلب قائمة المعلمين. يرجى المحاولة لاحقاً.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
              سعر الدورة <span className="text-[#ef4444]">*</span>
            </label>
            <div className={inputContainerStyles}>
              <DollarSign size={20} className={iconStyles} />
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => {
                  const v = e.target.value;
                  setPrice(v === '' ? '' : Number(v));
                }}
                placeholder="ضع 0 للدورات المجانية"
                className={inputStyles}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
              العملة
            </label>
            <div className={inputContainerStyles}>
              <Globe size={20} className={iconStyles} />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={selectStyles}
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-outline">
                ▼
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
            وصف الدورة بالتفصيل
          </label>
          <div className={inputContainerStyles}>
            <FileText
              size={20}
              className="absolute right-4 top-4 text-outline/70 group-hover:text-primary transition-colors pointer-events-none z-10"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة شاملة عن محتويات الدورة، الفئة المستهدفة، والمتطلبات..."
              className={textareaStyles}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
            تصنيف الدورة
          </label>
          <div className={inputContainerStyles}>
            <Tag size={20} className={iconStyles} />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="أدخل تصنيف الدورة (مثل: رياضيات، تقنية...)"
              className={inputStyles}
            />
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-4 border-t border-outline-variant/30">
        <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container pb-2 border-b border-outline-variant flex items-center gap-2 font-bold">
          <ImageIcon size={20} />
          الوسائط والمحتوى الترويجي
        </h3>

        <div className="space-y-2">
          <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
            رابط الصورة المصغرة (Thumbnail URL)
          </label>
          <div className={inputContainerStyles}>
            <ImageIcon size={20} className={iconStyles} />
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className={inputStyles}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant/70 pr-1">
            رابط مباشر لصورة الغلاف الخاصة بالدورة (أبعاد 16:9 موصى بها).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
              رابط الفيديو التعريفي
            </label>
            <div className={inputContainerStyles}>
              <Video size={20} className={iconStyles} />
              <input
                type="url"
                value={promoVideoUrl}
                onChange={(e) => setPromoVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={inputStyles}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
              مزود الفيديو
            </label>
            <div className={inputContainerStyles}>
              <Globe size={20} className={iconStyles} />
              <select
                value={promoVideoProvider}
                onChange={(e) => setPromoVideoProvider(e.target.value as 'YOUTUBE' | 'BUNNY')}
                className={selectStyles}
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="BUNNY">Bunny.net</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-outline">
                ▼
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
