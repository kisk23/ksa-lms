import RevealSection from './reusable/RevealSection';
import SectionLabel from './reusable/SectionLabel';

export default function WhoWeServeSection() {
  const cards = [
    {
      emoji: '🎒',
      title: 'الطلاب',
      subtitle: 'الشغوفون بالتعلم',
      description:
        'نوفر لك بيئة تعليمية آمنة تحترم إيقاعك، مع محتوى تفاعلي، ومتابعة فردية، وامتحانات تقيس فهمك الحقيقي لا حفظك.',
      color: '#2446b8',
      bg: 'from-primary/15 to-transparent',
      border: 'border-primary/25 hover:border-primary/60',
    },
    {
      emoji: '👩‍🏫',
      title: 'المدرسون',
      subtitle: 'أصحاب الرسالة',
      description:
        'نمنحك منصة احترافية تُبرز موهبتك، وتوصلك بآلاف الطلاب الذين يبحثون عنك، مع أدوات تتبع وتحليل تجعل تدريسك أكثر أثراً.',
      color: '#7c3aed',
      bg: 'from-secondary/15 to-transparent',
      border: 'border-secondary/25 hover:border-secondary/60',
    },
    {
      emoji: '👨‍👩‍👦',
      title: 'أولياء الأمور',
      subtitle: 'السند الحقيقي',
      description:
        'نجعلك شريكاً في مسيرة ابنك التعليمية. تابع تقدمه، اطّلع على تقاريره، وكن على دراية بكل خطوة يخطوها.',
      color: '#10b981',
      bg: 'from-[#10b981]/15 to-transparent',
      border: 'border-[#10b981]/25 hover:border-[#10b981]/60',
    },
  ];

  return (
    <section className="py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <RevealSection className="text-center mb-14">
          <SectionLabel>لمن نبني</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            نخدم كل ركن في العملية التعليمية
          </h2>
        </RevealSection>

        <div className="grid sm:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <RevealSection key={c.title} delay={i * 100}>
              <div
                className={`rounded-2xl p-7 border ${c.border} bg-linear-to-b ${c.bg} bg-white/50 transition-all duration-300 hover:shadow-lg h-full flex flex-col group`}
              >
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {c.emoji}
                </div>
                <h3 className="font-black text-gray-900 text-xl mb-1">{c.title}</h3>
                <p className="text-xs font-semibold mb-4" style={{ color: c.color }}>
                  {c.subtitle}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{c.description}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
