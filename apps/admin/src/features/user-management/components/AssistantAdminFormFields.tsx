import { ChevronDown, IdCard, Mail, Phone, User } from 'lucide-react';

import { FormField } from './FormField';
import type { AssistantAdminFormFieldsProps } from '../types';

export function AssistantAdminFormFields({
  name,
  onChangeName,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  identity,
  onChangeIdentity,
  touched,
  onBlur,
  inputStyles,
  isNameValid,
  isEmailValid,
  isPhoneValid,
  isIdentityValid,
  handlePhoneChange,
}: AssistantAdminFormFieldsProps) {
  return (
    <>
      {/* Section 1: Personal Details */}
      <section className="space-y-6">
        <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
          البيانات الشخصية للمشرف
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField
            label="الاسم الثلاثي للمشرف"
            error={
              touched.name && !isNameValid ? 'يجب أن يتكون الاسم من 3 أحرف على الأقل' : undefined
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
                placeholder="الاسم الثلاثي للمشرف"
                type="text"
              />
            </div>
          </FormField>

          {/* Email Address */}
          <FormField
            label="البريد الإلكتروني للمشرف"
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
                placeholder="admin@example.com"
                type="email"
              />
            </div>
          </FormField>

          {/* Phone Number */}
          <FormField
            label="رقم هاتف المشرف"
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
        </div>
      </section>

      {/* Section 2: Verification / Professional ID */}
      <section className="space-y-6">
        <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
          التحقق وبيانات الصلاحيات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <FormField
            label="رقم الهوية الوطنية للمشرف"
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
