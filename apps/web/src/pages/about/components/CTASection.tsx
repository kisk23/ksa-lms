import Link from 'next/link';
import RevealSection from './reusable/RevealSection';
import SectionLabel from './reusable/SectionLabel';

// TODO: Update NEXT_PUBLIC_CONTACT_EMAIL in your .env file once the official
// Sulam domain/email is ready. See .env.example for the placeholder.
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@sulam.sa';

export default function CTASection() {
  return (
    <section className="py-32 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
  w-[600px] h-[600px]
  bg-primary
  opacity-[0.04]
  rounded-full
  blur-[120px]"
/>

<div className="absolute top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
  w-[300px] h-[300px]
  bg-secondary
  opacity-[0.05]
  rounded-full
  blur-[80px]"
/>
      </div>

      <RevealSection className="relative z-10 max-w-3xl mx-auto text-center">
        <SectionLabel>انضم إلينا</SectionLabel>
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
          الخطوة الأولى في سُلَّمك
          <span className="block text-transparent bg-linear-to-l from-secondary to-primary bg-clip-text mt-1">
            تبدأ الآن
          </span>
        </h2>
        <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
          انضم لمنصتنا. التسجيل مجاني، والأثر حقيقي.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={"/register"} className="px-10 py-4 rounded-[0.75rem] bg-primary hover:bg-primary-hover text-white font-bold text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(36,70,184,0.5)] active:scale-95">
            سجل دخولك الآن
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="px-10 py-4 rounded-[0.75rem] border border-gray-300 hover:border-secondary/60 text-gray-600 hover:text-gray-900 font-semibold text-base transition-all duration-300 bg-white/70">
            تواصل معنا
          </a>
        </div>
      </RevealSection>
    </section>
  );
}