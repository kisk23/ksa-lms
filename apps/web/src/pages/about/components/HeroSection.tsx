import RevealSection from './reusable/RevealSection';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 bg-linear-to-b from-primary/5 via-white to-white ">
      <RevealSection>
        <div className="max-w-[900px] mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-[0.22em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
            حكاية سُلَّم
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-8">
            لأن التعليم مش مجرد كتاب،{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-l from-primary to-secondary">
              بل رحلة بنبنيها خطوة بخطوة.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-loose max-w-[660px] mx-auto">
            بدأنا من فكرة بسيطة: إزاي نخلي الطالب يحس إنه مش لوحده، ونقرب المسافة بين المعلم اللي
            بيدي من قلبه، وولي الأمر اللي بيطمن على مستقبله.
          </p>
        </div>
      </RevealSection>
    </section>
  );
}
