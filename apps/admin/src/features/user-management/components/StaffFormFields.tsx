import { ChevronDown, IdCard, Mail, Phone, User } from 'lucide-react';

import { FormField } from './FormField';
import type { StaffFormFieldsProps } from '../types';

export function StaffFormFields({ role, form }: StaffFormFieldsProps) {
  const isTeacher = role === 'TEACHER';

  const section1Title = isTeacher ? 'البيانات الشخصية والمهنية' : 'البيانات الشخصية للمشرف';
  const nameLabel = isTeacher ? 'الاسم الثلاثي للمعلم' : 'الاسم الثلاثي للمشرف';
  const emailLabel = isTeacher ? 'البريد الإلكتروني للمعلم' : 'البريد الإلكتروني للمشرف';
  const emailPlaceholder = isTeacher ? 'teacher@example.com' : 'admin@example.com';
  const phoneLabel = isTeacher ? 'رقم هاتف المعلم' : 'رقم هاتف المشرف';

  const section2Title = isTeacher ? 'التحقق والبيانات المهنية' : 'التحقق وبيانات الصلاحيات';
  const identityLabel = isTeacher
    ? 'رقم الهوية الوطنية / الإقامة للمعلم'
    : 'رقم الهوية الوطنية للمشرف';

  return (
    <>
      {/* Section 1: Personal Details */}
      <section className="space-y-6">
        <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
          {section1Title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField
            label={nameLabel}
            error={
              form.touched.name && !form.isNameValid
                ? 'يجب أن يتكون الاسم من 3 أحرف على الأقل'
                : undefined
            }
          >
            <div className="relative w-full">
              <User
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
              />
              <input
                required
                name="name"
                value={form.data.name}
                onChange={(e) => form.onChange('name', e.target.value)}
                onBlur={() => form.onBlur('name')}
                className={form.inputStyles}
                placeholder={nameLabel}
                type="text"
              />
            </div>
          </FormField>

          {/* Email Address */}
          <FormField
            label={emailLabel}
            error={
              form.touched.email && !form.isEmailValid(form.data.email)
                ? 'البريد الإلكتروني المدخل غير صالح'
                : undefined
            }
          >
            <div className="relative w-full">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
              />
              <input
                required
                name="email"
                value={form.data.email}
                onChange={(e) => form.onChange('email', e.target.value)}
                onBlur={() => form.onBlur('email')}
                className={`${form.inputStyles} text-left`}
                dir="ltr"
                placeholder={emailPlaceholder}
                type="email"
              />
            </div>
          </FormField>

          {/* Phone Number */}
          <FormField
            label={phoneLabel}
            error={
              form.touched.phone && !form.isPhoneValid(form.data.phone)
                ? 'رقم الجوال غير صالح. يجب أن يبدأ بـ 5 ويتكون من 9 أرقام'
                : undefined
            }
          >
            <div className="flex gap-2" dir="ltr">
              <div className="relative w-28 shrink-0">
                <select
                  required
                  className="w-full pl-8 pr-2 py-3 bg-surface border border-outline-variant rounded-lg outline-none appearance-none font-body-md-ar text-body-md-ar text-on-surface cursor-not-allowed"
                  dir="ltr"
                  disabled
                >
                  <option>SA +966</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                />
              </div>
              <div className="relative flex-1" dir="rtl">
                <Phone
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline z-10 pointer-events-none"
                />
                <input
                  required
                  name="phone"
                  value={form.data.phone}
                  onChange={(e) => form.handlePhoneChange(e, 'phone')}
                  onBlur={() => form.onBlur('phone')}
                  className={`${form.inputStyles} text-left`}
                  dir="ltr"
                  placeholder="5xxxxxxxx"
                  type="tel"
                  maxLength={10}
                />
              </div>
            </div>
          </FormField>
        </div>
      </section>

      {/* Section 2: Verification / Professional ID */}
      <section className="space-y-6">
        <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
          {section2Title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <FormField
            label={identityLabel}
            error={
              form.touched.identity && !form.isIdentityValid(form.data.identity)
                ? 'يجب أن يكون بين 3 و 20 حرفاً'
                : undefined
            }
          >
            <div className="relative w-full">
              <IdCard
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
              />
              <input
                required
                name="identity"
                value={form.data.identity}
                onChange={(e) => form.onChange('identity', e.target.value)}
                onBlur={() => form.onBlur('identity')}
                className={form.inputStyles}
                placeholder="رقم الهوية الوطنية"
                type="text"
              />
            </div>
          </FormField>
          <div className="hidden md:block" />
        </div>
      </section>
    </>
  );
}
