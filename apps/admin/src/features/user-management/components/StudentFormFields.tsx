import { ChevronDown, IdCard, Mail, Phone, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { FormField } from './FormField';
import type { StudentFormFieldsProps } from '../types';

const relationshipOptions: { value: string; label: string }[] = [
  { value: 'FATHER', label: 'أب' },
  { value: 'MOTHER', label: 'أم' },
  { value: 'GUARDIAN', label: 'وصي' },
  { value: 'SIBLING', label: 'أخ / أخت' },
  { value: 'OTHER', label: 'أخرى' },
];

export function StudentFormFields({ form }: StudentFormFieldsProps) {
  return (
    <>
      {/* Section 1: Personal Details */}
      <section className="space-y-6">
        <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
          البيانات الشخصية والتعليمية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField
            label="الاسم رباعي للطالب"
            error={
              form.touched.name && !form.isNameValid
                ? 'يجب إدخال الاسم رباعي للطالب (٤ أسماء على الأقل)'
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
                placeholder="أدخل الاسم رباعي للطالب"
                type="text"
              />
            </div>
          </FormField>

          {/* Email Address */}
          <FormField
            label="البريد الإلكتروني للطالب"
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
                placeholder="student@example.com"
                type="email"
              />
            </div>
          </FormField>

          {/* Phone Number */}
          <FormField
            label="رقم هاتف الطالب"
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

          {/* Student ID */}
          <FormField
            label="رقم هوية الطالب"
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
                placeholder="رقم هوية الطالب"
                type="text"
              />
            </div>
          </FormField>
        </div>
      </section>

      {/* Section 2: Guardian Information */}
      <section className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
          <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container">
            بيانات ولي الأمر والتحقق
          </h3>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 select-none">
            <span className="font-caption-ar text-sm text-on-surface-variant font-medium">
              إضافة بيانات ولي الأمر
            </span>
            <div
              onClick={form.onToggleParentInfo}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                form.hasParentInfo
                  ? 'bg-primary-container justify-end'
                  : 'bg-outline/30 justify-start'
              }`}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className="w-5 h-5 bg-surface rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {form.hasParentInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Guardian Name */}
                <FormField
                  label="اسم ولي الأمر"
                  error={
                    form.touched.guardianName && form.data.guardianName.trim().length < 3
                      ? 'يجب إدخال اسم ولي الأمر (3 أحرف على الأقل)'
                      : undefined
                  }
                >
                  <div className="relative w-full">
                    <Users
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                    />
                    <input
                      required={form.hasParentInfo}
                      name="guardianName"
                      value={form.data.guardianName}
                      onChange={(e) => form.onChange('guardianName', e.target.value)}
                      onBlur={() => form.onBlur('guardianName')}
                      className={form.inputStyles}
                      placeholder="أدخل اسم ولي الأمر"
                      type="text"
                    />
                  </div>
                </FormField>

                {/* Guardian Relationship */}
                <FormField label="صلة القرابة">
                  <div className="relative w-full">
                    <select
                      name="guardianRelationship"
                      value={form.data.guardianRelationship}
                      onChange={(e) => form.onChange('guardianRelationship', e.target.value)}
                      className={`${form.inputStyles} appearance-none`}
                    >
                      {relationshipOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                    />
                  </div>
                </FormField>

                {/* Guardian Phone */}
                <FormField
                  label="رقم هاتف ولي الأمر"
                  error={
                    form.touched.guardianPhone && !form.isPhoneValid(form.data.guardianPhone)
                      ? 'رقم جوال ولي الأمر غير صالح. يجب أن يبدأ بـ 5 ويتكون من 9 أرقام'
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
                        required={form.hasParentInfo}
                        name="guardianPhone"
                        value={form.data.guardianPhone}
                        onChange={(e) => form.handlePhoneChange(e, 'guardianPhone')}
                        onBlur={() => form.onBlur('guardianPhone')}
                        className={`${form.inputStyles} text-left`}
                        dir="ltr"
                        placeholder="5xxxxxxxx"
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </FormField>

                {/* Guardian Identity — also used as login password */}
                <FormField
                  label="رقم هوية ولي الأمر (تُستخدم كلمة مرور الدخول)"
                  error={
                    form.touched.guardianIdentity &&
                    !form.isIdentityValid(form.data.guardianIdentity)
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
                      required={form.hasParentInfo}
                      name="guardianIdentity"
                      value={form.data.guardianIdentity}
                      onChange={(e) => form.onChange('guardianIdentity', e.target.value)}
                      onBlur={() => form.onBlur('guardianIdentity')}
                      className={form.inputStyles}
                      placeholder="رقم هوية ولي الأمر"
                      type="text"
                    />
                  </div>
                </FormField>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
