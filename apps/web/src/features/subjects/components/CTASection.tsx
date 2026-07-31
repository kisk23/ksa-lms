import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  supportTitle?: string;
  supportDescription?: string;
  supportActionLabel?: string;
}

export function CTASection({
  title = 'ابدأ رحلتك مع سُلَّم التعليمية',
  description = 'نقدم لك مساراً تعليمياً متكاملاً يبدأ من تقييم مستواك الحالي وينتهي بضمان نجاحك في اختباراتك النهائية.',
  primaryActionLabel = 'اشترك الآن',
  secondaryActionLabel = 'انضم كمعلم',
  supportTitle = 'تحتاج مساعدة؟',
  supportDescription = 'فريق الدعم متاح ٢٤/٧ لمساعدتك في اختيار المعلم المناسب.',
  supportActionLabel = 'تواصل معنا عبر الواتساب',
}: CTASectionProps) {
  return (
    <section className="grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2 gap-6">
      <div className="relative flex flex-col justify-center overflow-hidden bg-primary-container p-16 text-white">
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">{title}</h2>
          <p className="mb-10 max-w-md text-lg leading-relaxed text-gray-300">{description}</p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/register"
              className="rounded-lg bg-secondary-container px-10 py-3 font-bold text-on-secondary-fixed transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {primaryActionLabel}
            </Link>
            <Link
              href="#"
              className="rounded-lg border border-white px-10 py-3 font-bold text-white transition-all hover:bg-white/10 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {secondaryActionLabel}
            </Link>
          </div>
        </div>
        <span
          className="material-symbols-outlined pointer-events-none absolute -bottom-12 left-0 text-[240px] opacity-10"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          سُلَّم
        </span>
      </div>

      <div className="flex flex-col justify-center border-t border-outline-variant bg-surface-container-high p-16 lg:border-t-0 lg:border-r">
        <h4 className="mb-3 text-2xl font-semibold text-primary-container">{supportTitle}</h4>
        <p className="mb-10 max-w-sm text-base leading-relaxed text-on-surface-variant">
          {supportDescription}
        </p>
        <a
          href="#"
          className="flex items-center gap-2 font-bold text-primary-container transition-all hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-container"
        >
          <span>{supportActionLabel}</span>
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
