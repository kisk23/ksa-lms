import type { Value } from '@/types/about';
import RevealSection from './reusable/RevealSection';
import SectionLabel from './reusable/SectionLabel';

export default function ValuesSection() {
  const VALUES: Value[] = [
    {
      icon: '🎯',
      title: 'الطالب أولاً',
      description: 'كل قرار نتخذه ينبع من سؤال واحد: هل يفيد الطالب؟',
    },
    {
      icon: '✨',
      title: 'جودة لا تهادن',
      description: 'محتوى مُراجَع، مدرسون منتقون، وتجربة تعليمية لا تقبل الوسط.',
    },
    {
      icon: '🔍',
      title: 'شفافية كاملة',
      description: 'لا رسوم مخفية، لا وعود فارغة. كل شيء واضح من اليوم الأول.',
    },
    {
      icon: '💡',
      title: 'ابتكار مستمر',
      description: 'نبحث دائماً عن طرق أذكى لنجعل التعلم اسهل.',
    },
    {
      icon: '🤝',
      title: 'مجتمع حقيقي',
      description: 'لسنا منصة فقط، نحن مجتمع من الطلاب والمعلمين وأولياء الأمور.',
    },
    {
      icon: '📈',
      title: 'نمو لا يتوقف',
      description: 'نؤمن أن كل شخص قادر على التطور إذا وُفِّرت له البيئة الصحيحة.',
    },
  ];

  return (
    <section className="py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <RevealSection className="text-center mb-14">
          <SectionLabel>ما نؤمن به</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">قيمنا الأساسية</h2>
        </RevealSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((v, i) => (
            <RevealSection key={v.title} delay={i * 80}>
              <div className="group rounded-2xl p-6 bg-white border border-gray-200 hover:border-primary/50 hover:bg-white/80 transition-all duration-300 hover:shadow-[0_0_24px_rgba(36,70,184,0.12)] h-full">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {v.icon}
                </div>
                <h3 className="font-black text-gray-900 text-base mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            </RevealSection>
          ))}
        </div>
        <div className="relative py-28 mt-8 overflow-hidden rounded-3xl bg-linear-to-br from-primary/5 via-white to-secondary/5 border border-gray-200">
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 max-w-[820px] mx-auto px-5 text-center">
            <RevealSection>
              <span className="text-7xl text-primary opacity-30 block mb-6 leading-none">&quot;</span>
              <blockquote className="text-xl md:text-2xl font-semibold text-gray-800 italic leading-relaxed mb-8">
                أجمل لحظة في سُلَّم لما بنشوف طالب كان خايف من مادة، وفجأة بفضل ربنا ثم مدرس مخلص،
                دخل الامتحان وهو واثق من نفسه.. دي قيمتنا الحقيقية.
              </blockquote>
              <cite className="text-xs font-bold tracking-[0.2em] uppercase text-primary not-italic">
                — فريق سُلَّم
              </cite>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}
