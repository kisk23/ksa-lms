import RevealSection from './reusable/RevealSection';
import SectionLabel from './reusable/SectionLabel';

export default function HowWeWorkSection() {
  const STEPS: Step[] = [
    { number: '01', title: 'تعلّم', description: 'محتوى منظّم وشامل يناسب مستواك ووتيرتك الخاصة.' },
    {
      number: '02',
      title: 'تدرّب',
      description: 'تمارين وتحديات تُرسّخ ما تعلّمته وتقيس فهمك الحقيقي.',
    },
    {
      number: '03',
      title: 'تابع تقدّمك',
      description: 'لوحة بيانات واضحة تُظهر نقاط قوتك وما يحتاج مزيداً من الاهتمام.',
    },
    {
      number: '04',
      title: 'حقّق هدفك',
      description: 'شهادات معتمدة ونتائج ملموسة تفتح لك أبواباً جديدة.',
    },
  ];

  return (
    <section className="py-28 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <RevealSection className="text-center mb-16">
          <SectionLabel>طريقة عملنا</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            رحلتك من الشك إلى اليقين
          </h2>
        </RevealSection>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 right-[12.5%] left-[12.5%] h-px bg-linear-to-l from-secondary/20 via-primary/40 to-secondary/20" />

          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <RevealSection key={step.number} delay={i * 120}>
                <div className="flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full border-2 border-gray-200 group-hover:border-primary bg-white flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(36,70,184,0.3)]">
                      <span className="text-2xl font-black bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
