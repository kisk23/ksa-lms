import { ChevronDown, IdCard, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { FormField } from './FormField';
import type { StudentFormFieldsProps } from '../types';

export function StudentFormFields({
  name,
  onChangeName,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  identity,
  onChangeIdentity,
  guardianIdentity,
  onChangeGuardianIdentity,
  guardianPhone,
  onChangeGuardianPhone,
  hasParentInfo,
  onToggleParentInfo,
  touched,
  onBlur,
  inputStyles,
  isNameValid,
  isEmailValid,
  isPhoneValid,
  isIdentityValid,
  handlePhoneChange,
}: StudentFormFieldsProps) {
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
              touched.name && !isNameValid
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
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                onBlur={() => onBlur('name')}
                className={inputStyles}
                placeholder="أدخل الاسم رباعي للطالب"
                type="text"
              />
            </div>
          </FormField>

          {/* Email Address */}
          <FormField
            label="البريد الإلكتروني للطالب"
            error={
              touched.email && !isEmailValid(email)
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
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                onBlur={() => onBlur('email')}
                className={`${inputStyles} text-left`}
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
              touched.phone && !isPhoneValid(phone)
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
                  value={phone}
                  onChange={(e) => handlePhoneChange(e, onChangePhone)}
                  onBlur={() => onBlur('phone')}
                  className={`${inputStyles} text-left`}
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
              touched.identity && !isIdentityValid(identity)
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
                value={identity}
                onChange={(e) => onChangeIdentity(e.target.value)}
                onBlur={() => onBlur('identity')}
                className={inputStyles}
                placeholder="رقم هوية الطالب"
                type="text"
              />
            </div>
          </FormField>
        </div>
      </section>

      {/* Section 2: Verification / Guardian Links */}
      <section className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
          <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container">
            بيانات ولي الأمر والتحقق
          </h3>

          {/* Toggle Switch with Framer Motion Layout Animation */}
          <div className="flex items-center gap-3 select-none">
            <span className="font-caption-ar text-sm text-on-surface-variant font-medium">
              إضافة بيانات ولي الأمر
            </span>
            <div
              onClick={onToggleParentInfo}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                hasParentInfo ? 'bg-primary-container justify-end' : 'bg-outline/30 justify-start'
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
          {hasParentInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Guardian Phone */}
                <FormField
                  label="رقم هاتف ولي الأمر"
                  error={
                    touched.guardianPhone && !isPhoneValid(guardianPhone)
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
                        required={hasParentInfo}
                        name="guardianPhone"
                        value={guardianPhone}
                        onChange={(e) => handlePhoneChange(e, onChangeGuardianPhone)}
                        onBlur={() => onBlur('guardianPhone')}
                        className={`${inputStyles} text-left`}
                        dir="ltr"
                        placeholder="5xxxxxxxx"
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </FormField>

                {/* Guardian Identity */}
                <FormField
                  label="رقم هوية ولي الأمر"
                  error={
                    touched.guardianIdentity && !isIdentityValid(guardianIdentity)
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
                      required={hasParentInfo}
                      name="guardianIdentity"
                      value={guardianIdentity}
                      onChange={(e) => onChangeGuardianIdentity(e.target.value)}
                      onBlur={() => onBlur('guardianIdentity')}
                      className={inputStyles}
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
