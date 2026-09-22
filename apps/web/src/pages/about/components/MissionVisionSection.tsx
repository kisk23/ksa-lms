import RevealSection from './reusable/RevealSection';
import SectionLabel from './reusable/SectionLabel';

export default function MissionVisionSection() {
  return (
    <section className="py-28 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <RevealSection className="text-center mb-14">
          <SectionLabel>غايتنا</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">رسالتنا ورؤيتنا</h2>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-6">
          <RevealSection>
            <div className="h-full rounded-2xl p-8 bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary/60 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-[0.75rem] bg-primary/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🎯
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">رسالتنا</h3>
              <p className="text-gray-600 leading-relaxed">
                تمكين كل طالب من الوصول إلى تعليم عالي الجودة، عبر ربطه بمدرسين متميزين وأدوات تعلّم
                ذكية تراعي طريقة تفكيره وإيقاعه الخاص.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={150}>
            <div className="h-full rounded-2xl p-8 bg-linear-to-br from-secondary/20 to-secondary/5 border border-secondary/30 hover:border-secondary/60 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-[0.75rem] bg-secondary/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🔭
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">رؤيتنا</h3>
              <p className="text-gray-600 leading-relaxed">
                عالم لا يُحدّد فيه مكان ميلادك أو إمكانات أسرتك مسار تعليمك. نحلم بيوم يقول فيه كل
                طالب: "وجدتُ المدرس الذي كنت أبحث عنه."
              </p>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
