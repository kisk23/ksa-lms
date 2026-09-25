import Image from 'next/image';
import RevealSection from './reusable/RevealSection';

export default function StorySection() {
  return (
    <section className="py-24 container mx-auto px-8">
      <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
        {/* Image side */}
        <RevealSection className="w-full md:w-[55%]">
          <div
            className="group relative w-full aspect-4/3 overflow-hidden shadow-2xl transition-all duration-1000"
            style={{
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJOD-w5kqn3H_ddn1b9rHdb9E8wDSM71BbC3GlcdE0v49IMhXAZZ2gYLXPcU4Jetvp7JTP8OKp7qc1gTRUdkjuUqTsUEWr1wGodxwS0Z4-XxmfWRjwiIRhmjgpfItcB5JvZnNCKhcFzMTLwik7g9X03KXaaaqHU7HgKpNziihnxDMUy6QRPwGJfarEoSy0-mjS_44d0WHhd6f5PoctON8F3AmDeunMKPxT6PJWfaT6GUZcTieOz_JKFZVxnkFxNm_XyK-HByxc2X02"
              alt="رحلة التعليم"
              fill
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </RevealSection>

        {/* Text side */}
        <RevealSection className="w-full md:w-[45%]">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-5">
            القصة وراء الاسم
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-7 leading-snug">
            &quot;سُلَّم&quot; مش مجرد كلمة، دي وعد بالارتفاع.
          </h2>
          <div className="space-y-5 text-gray-600 leading-loose">
            <p className="text-lg">
              اخترنا الاسم ده لأننا بنؤمن إن كل طالب عنده قمة خاصة بيه، ومحتاج الأداة الصح عشان
              يوصلها. التعليم مش حفظ ومراجعة، هو بناء كل يوم على اللي اتعلمته امبارح.
            </p>
            <p>
              إحنا مش مجرد منصة دروس، إحنا رفيق الرحلة اللي بيسند الطالب لما يقع، وبيفرح معاه في كل
              درجة بيطلعها. سُلَّم هو الجسر اللي بيربط بين الطموح والواقع، برؤية بتخلي التعليم متعة
              مش عبء.
            </p>
            <p>
              كل خطوة على السُلَّم مش بس درس، هي ثقة بتتبنى، ومهارة بتتعمق، وشخصية بتتشكل. ده اللي
              بنؤمن بيه، وده اللي بنبنيه كل يوم.
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
