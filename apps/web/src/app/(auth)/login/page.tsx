import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول - سُلَّم',
  description: 'سجّل دخولك إلى منصة سُلَّم التعليمية',
};

const PANEL = {
  imageSrc:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCAs7SHJ7vw6OXR3EACxJJKiS2OfIDXC8f8dN6aCMar__knb17G05i5pdMQsJ9G7fbSjRDsHhzVEf3bYu2u8VuWBczltyNlst5PU31j-tLyX1cPiclDuinEqm4c4ldDYVzaMhBKFCX14mItjXy-d_KQ6l6lfsEVAU0nWXqTcPv8cAWf5D0v99Ix0MJMonzo9iLimAp_rftzOWnODWvep4-0WE3SiAzQD1gKsgKB_dilNH3_H8e2rAXzB8iCb_R8ZgMIlxbG_YrzChAQ',
  imageAlt: 'مكتبة جامعية حديثة، طلاب يدرسون بتركيز على مكاتب خشبية، ضوء طبيعي ساطع',
  heading: 'ارتقِ بطموحك، خطوة بخطوة نحو النجاح',
  subheading:
    'منصتك التعليمية المتكاملة للوصول إلى أعلى المراتب الأكاديمية. نحن نوفر لك الهيكل والدعم لتتسلق سلم المعرفة بثقة.',
};

export default function LoginPage() {
  return (
    <AuthLayout panel={PANEL}>
      <LoginForm />
    </AuthLayout>
  );
}
