import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { VerifyOtpForm } from '@/features/auth/components/VerifyOtpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'التحقق من الحساب - سُلَّم',
  description: 'أدخل رمز التحقق المرسل إلى جوالك',
};

const PANEL = {
  imageSrc:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCAs7SHJ7vw6OXR3EACxJJKiS2OfIDXC8f8dN6aCMar__knb17G05i5pdMQsJ9G7fbSjRDsHhzVEf3bYu2u8VuWBczltyNlst5PU31j-tLyX1cPiclDuinEqm4c4ldDYVzaMhBKFCX14mItjXy-d_KQ6l6lfsEVAU0nWXqTcPv8cAWf5D0v99Ix0MJMonzo9iLimAp_rftzOWnODWvep4-0WE3SiAzQD1gKsgKB_dilNH3_H8e2rAXzB8iCb_R8ZgMIlxbG_YrzChAQ',
  imageAlt: 'طلاب يدرسون في بيئة تعليمية حديثة',
  heading: 'خطوة أخيرة لتفعيل حسابك',
  subheading: 'نحمي حسابك برمز تحقق لمرة واحدة يُرسل إلى رقم جوالك المسجّل.',
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout panel={PANEL}>
      <VerifyOtpForm />
    </AuthLayout>
  );
}
