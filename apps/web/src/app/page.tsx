'use client';

import {
  Rocket,
  Monitor,
  Sparkles,
  Globe,
  Mail,
  MessageCircle,
  Share2,
  User,
  Trophy,
  Brain,
  HeartHandshake,
} from 'lucide-react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeInSection, FadeInItem } from '@/shared/components/FadeInSection';

const EDUCATORS = [
  {
    name: 'أ. سارة المنصور',
    role: 'خبير تعليم التفكير النقدي',
    bio: 'خبرة تتجاوز 10 سنوات في تنمية مهارات الطلاب وبناء بيئة تعليمية محفزة للإبداع والتفكير المستقل.',
    bgGradient: 'from-primary/20 to-secondary/30',
  },
  {
    name: 'د. عمر خالد',
    role: 'مدير برنامج الذكاء الاصطناعي والعلوم',
    bio: 'يجمع عمر بين التكنولوجيا والإبداع لإشعال التفكير المنطقي والبحث العلمي والابتكار لدى العقول الفضولية.',
    bgGradient: 'from-secondary/20 to-primary/30',
  },
  {
    name: 'أ. نورة سعد',
    role: 'أخصائية تطوير المهارات الإدراكية',
    bio: 'تبني نورة مناهج متوائمة تنموياً مع تركيز قوي على النمو العاطفي والاجتماعي والمعرفي لكل طالب.',
    bgGradient: 'from-primary/30 to-success/20',
  },
];

export default function HomePage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.15]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div className="relative">
      {/* First Screen: Hero Content (Sticky in background, fades on scroll, animates on mount via FadeInSection) */}
      <section className="sticky top-0 lg:top-20 h-[calc(100vh-80px)] w-full flex flex-col justify-center pb-32 lg:pb-40 overflow-hidden z-0">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="w-full">
          {/* Hero Content Grid - Immediate staggered entrance animation on mount */}
          <FadeInSection
            animateImmediate
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-6 z-10 max-w-7xl mx-auto px-4 lg:px-8 w-full"
          >
            {/* Right Content in RTL */}
            <div className="flex flex-col justify-center max-w-2xl relative z-10">
              <FadeInItem>
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight mb-6 flex flex-col gap-3">
                  <span className="text-black">تعلّم بذكاء،</span>
                  <span className="text-primary">واصعد نحو القمة!</span>
                </h1>
              </FadeInItem>

              <FadeInItem>
                <p className="text-base lg:text-lg text-text-muted mb-8 max-w-lg leading-relaxed">
                  رحلة تعليمية ممتعة مصممة خصيصاً لتطوير مهاراتك من خلال مسارات تفاعلية، تحديات
                  مشوقة، ومجتمع داعم يحفزك على الإنجاز.
                </p>
              </FadeInItem>

              <FadeInItem>
                <div className="flex flex-wrap items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-success hover:bg-success/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(22,184,138,0.4)] hover:shadow-[0_0_25px_rgba(22,184,138,0.6)]"
                  >
                    انضم للتحدي الآن <Rocket className="w-6 h-6" />
                  </motion.button>
                </div>
              </FadeInItem>
            </div>

            {/* Left Content in RTL - Illustration area */}
            <FadeInItem className="relative flex justify-center items-center w-full min-h-[350px] lg:min-h-[400px]">
              {/* Floating screen box with smooth Framer Motion floating animation */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-sm lg:max-w-md aspect-square rounded-3xl border border-border flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10" />

                {/* Center icon */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <Monitor className="w-20 h-20 lg:w-24 lg:h-24 text-primary opacity-80" />
                  <p className="font-medium text-lg text-text-muted">بيئة تعليمية تفاعلية</p>
                </div>

                {/* Decorative animated rings mimicking the screenshot's orange rings */}
                <div className="absolute w-[110%] h-[110%] border-2 border-primary/40 rounded-[35%] animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[125%] h-[125%] border-2 border-secondary/40 rounded-[42%] animate-[spin_25s_linear_infinite_reverse]" />
              </motion.div>
            </FadeInItem>
          </FadeInSection>
        </motion.div>
      </section>

      {/* Second Section: Slanted Stats Banner + Why Choose Us + Meet Your Educators (Scrolls UP over the sticky hero!) */}
      <section
        className="bg-[#eff1f7] relative z-20 w-full -mt-36 lg:-mt-44"
        style={{ clipPath: 'polygon(0 3vw, 100% 0, 100% 100%, 0 100%)' }}
      >
        {/* Slanted Stats Banner (Trigger animation once on scroll into view!) */}
        <FadeInSection className="pt-[4vw] pb-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center relative z-10 rounded-2xl px-6 py-2 max-w-7xl mx-auto">
            <FadeInItem className="flex items-center gap-5 justify-center">
              <Image
                src="/video.svg"
                alt="المعلمون"
                width={56}
                height={56}
                className="w-14 h-14 lg:w-16 lg:h-16"
              />
              <div className="text-start">
                <h3 className="text-2xl lg:text-3xl font-bold text-[#122359] mb-1">300+</h3>
                <p className="text-text-muted font-medium text-sm lg:text-base">وحدة تفاعلية</p>
              </div>
            </FadeInItem>

            <FadeInItem className="flex items-center gap-5 justify-center">
              <Image
                src="/Star.svg"
                alt="الخبرة"
                width={56}
                height={56}
                className="w-14 h-14 lg:w-16 lg:h-16"
              />
              <div className="text-start">
                <h3 className="text-2xl lg:text-3xl font-bold text-[#122359] mb-1">12+</h3>
                <p className="text-text-muted font-medium text-sm lg:text-base">سنة من الخبرة</p>
              </div>
            </FadeInItem>

            <FadeInItem className="flex items-center gap-5 justify-center">
              <Image
                src="/group.svg"
                alt="المعلمون"
                width={56}
                height={56}
                className="w-14 h-14 lg:w-16 lg:h-16"
              />
              <div className="text-start">
                <h3 className="text-2xl lg:text-3xl font-bold text-[#122359] mb-1">25+</h3>
                <p className="text-text-muted font-medium text-sm lg:text-base">معلم موثوق</p>
              </div>
            </FadeInItem>
          </div>
        </FadeInSection>

        {/* Why Choose Us Section */}
        <FadeInSection className="py-20 w-full">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <FadeInItem className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#122359]">
                لماذا تختار <span className="text-success">سُلَّم؟</span>
              </h2>
            </FadeInItem>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image / Illustration Container */}
              <FadeInItem className="relative">
                <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-surface/30 backdrop-blur-sm aspect-[4/3] flex justify-center items-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Monitor className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">تعليم تفاعلي</h3>
                    <p className="text-text-muted text-sm max-w-xs">
                      يمكنك استبدال هذا المربع بصورتك عبر إضافة مكون Image هنا
                    </p>
                  </div>
                </div>
              </FadeInItem>

              {/* Text Content */}
              <FadeInItem className="flex flex-col gap-6 text-lg text-text-muted leading-relaxed">
                <p>
                  سُلَّم هي منصة تعليمية تفاعلية تدعم التطور الأكاديمي والشخصي للطلاب. نحن نقدم
                  دروساً في المواد الأساسية مثل الرياضيات، العلوم، واللغات من خلال أنشطة ممتعة
                  وجذابة.
                </p>
                <p>
                  منصتنا تركز على بناء الثقة بالنفس، المرونة، ومهارات التفكير النقدي. مع مسارات
                  تعليمية مخصصة، تضمن سُلَّم أن كل طالب يتعلم ويزدهر بالسرعة التي تناسبه.
                </p>
              </FadeInItem>
            </div>
          </div>
        </FadeInSection>

        {/* Third Section: Meet Your Educators */}
        <div className="py-24 w-full bg-[#eff1f7] text-[#122359] relative overflow-hidden">
          {/* Floating decorative sparkles matching the section theme */}
          <Sparkles className="absolute top-12 right-[15%] w-12 h-12 text-primary/30 animate-pulse hidden md:block" />
          <Sparkles className="absolute bottom-20 left-[10%] w-16 h-16 text-primary/30 animate-pulse hidden md:block" />

          <motion.div
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10"
          >
            {/* Heading Area - First Child */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: 'easeOut' },
                },
              }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 leading-tight text-[#122359]">
                <span>تعرف على أفضل</span>
                <span className="relative inline-flex items-center px-3.5 py-1 rounded-xl bg-gray-200/70 text-gray-400 font-bold text-2xl sm:text-3xl md:text-4xl line-through decoration-rose-500 decoration-wavy decoration-2 sm:decoration-3 select-none shadow-inner">
                  معلمينا
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-success via-emerald-500 to-teal-500 font-black relative inline-block">
                  معلميك
                  <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-success/40 to-emerald-400/40 rounded-full blur-[1px]"></span>
                </span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-text-muted font-normal max-w-2xl mx-auto leading-relaxed md:leading-loose">
                تعلم مع نخبة من المعلمين المتخصصين والشغوفين الذين يقدمون رعاية مخصصة وابتكاراً في
                رحلتك التعليمية.
              </p>
            </motion.div>

            {/* 3 Teacher Cards Grid - Variants container inheriting the stagger */}
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.15 } },
              }}
              className="grid md:grid-cols-3 gap-8 items-stretch"
            >
              {EDUCATORS.map((edu, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: 'easeOut' },
                    },
                  }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-primary/5 border border-border/50 flex flex-col justify-between transition-all duration-300 group h-full"
                >
                  {/* Card Banner / Geometric Background */}
                  <div
                    className={`h-56 w-full bg-gradient-to-br ${edu.bgGradient} relative overflow-hidden flex items-center justify-center p-6`}
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-sm transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-black/5 rounded-3xl transform -rotate-12" />

                    {/* Avatar box (Photo) - Animating simultaneously from scale: 0.95 */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        show: {
                          opacity: 1,
                          scale: 1,
                          transition: { duration: 0.6, ease: 'easeOut' },
                        },
                      }}
                      className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white relative z-10 group-hover:scale-105 transition-transform duration-300"
                    >
                      <User className="w-14 h-14 text-gray-400" />
                    </motion.div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex flex-col flex-grow justify-between bg-white">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#122359] mb-2 tracking-tight">
                        {edu.name}
                      </h3>
                      <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs sm:text-sm mb-4 shadow-sm">
                        {edu.role}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                        {edu.bio}
                      </p>
                    </div>

                    {/* Contact & Social Footer */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-primary">
                      <a
                        href="#"
                        aria-label="الموقع الشخصي"
                        className="hover:text-primary-hover transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        aria-label="البريد الإلكتروني"
                        className="hover:text-primary-hover transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        aria-label="مراسلة"
                        className="hover:text-primary-hover transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        aria-label="مشاركة الملف"
                        className="hover:text-primary-hover transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA Button */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: 'easeOut' },
                },
              }}
              className="mt-16 text-center"
            >
              <button className="bg-success hover:bg-success/90 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-[0_10px_25px_rgba(22,184,138,0.3)] hover:shadow-[0_15px_30px_rgba(22,184,138,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                تعرف على المزيد عنا
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Fourth Section: Here To Understand & Empower — REDESIGNED */}
        <div className="py-28 w-full bg-[#eff1f7] text-[#122359] relative overflow-hidden">
          {/* Rich ambient background */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-success/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/4 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-400/3 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            {/* ── HEADING ── */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center mb-20"
            >
              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm">
                <HeartHandshake className="w-4 h-4" />
                رسالتنا لكل طالب
              </div>

              {/* Main heading — stacked, bold, gradient-accented */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                <span className="block text-[#122359]">نحن هنا</span>
                <span className="block mt-1">
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 px-2">
                    لنفهمك
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="6"
                      viewBox="0 0 200 6"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 3 Q50 0 100 3 Q150 6 200 3"
                        stroke="url(#uline1)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="uline1" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <span className="mx-3 text-gray-300 font-light">و</span>
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-success to-emerald-400 px-2">
                    نمكّنك
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="6"
                      viewBox="0 0 200 6"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 3 Q50 6 100 3 Q150 0 200 3"
                        stroke="url(#uline2)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="uline2" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#16b88a" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </span>
              </h2>
              <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
                منهجنا لا يُعالج الأعراض — بل يُعيد بناء علاقة طفلك بالتعلم من الجذور.
              </p>
            </motion.div>

            {/* ── TWO BENTO CARDS ── */}
            <div className="grid md:grid-cols-2 gap-5 lg:gap-7 mb-14">
              {/* ── Card 1: Challenges ── */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-rose-50 via-[#fdf0ec] to-orange-50 border border-rose-100/80 shadow-2xl shadow-rose-200/30 flex flex-col min-h-[560px] group cursor-default"
              >
                {/* Decorative blurred blob */}
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top text */}
                <div className="p-8 pb-4 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-500 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm">
                    <Brain className="w-3.5 h-3.5" />
                    التحديات الشائعة
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#122359] mb-3 tracking-tight leading-snug">
                    هل يواجه طفلك عقبات في التعلم؟
                  </h3>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-sm">
                    قد يعاني الأطفال من صعوبات في التركيز أو الثقة أو استيعاب المفاهيم في البيئات
                    التقليدية.
                  </p>

                  {/* Animated challenge pills */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {['صعوبة التركيز', 'قلق الامتحانات', 'فقدان الحافز', 'بطء الاستيعاب'].map(
                      (tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + 0.3, duration: 0.4, ease: 'backOut' }}
                          className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-rose-200/60 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                          {tag}
                        </motion.span>
                      ),
                    )}
                  </div>
                </div>

                {/* Image + badges area */}
                <div className="relative flex-1 flex items-end justify-center overflow-hidden min-h-[280px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-[#f8d9ca]/70 z-0" />

                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0 rotate-[-12deg]"
                    viewBox="0 0 400 300"
                  >
                    <motion.path
                      d="M 30,160 A 170,45 0 0,1 370,160"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.6 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
                    />
                  </svg>

                  <Image
                    src="/child_struggling_learning_1782938261849.png"
                    alt="طفلة تواجه صعوبات في التعلم"
                    width={320}
                    height={320}
                    className="relative z-10 object-contain drop-shadow-xl group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    style={{ maxHeight: 320 }}
                  />

                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-20 rotate-[-12deg]"
                    viewBox="0 0 400 300"
                  >
                    <motion.path
                      d="M 370,160 A 170,45 0 0,1 30,160"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.8 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeInOut', delay: 1.3 }}
                    />
                  </svg>

                  {/* Circular progress badges */}
                  {/* Top-right: صعوبات التعلم */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'backOut', delay: 0.3 }}
                    className="absolute right-4 top-4 z-20"
                  >
                    <div className="bg-white/95 backdrop-blur-md border border-rose-100 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.10)] flex flex-col items-center gap-1.5">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#fee2e2"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.68) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                          style={{ transformOrigin: '34px 34px', transform: 'rotate(-90deg)' }}
                        />
                        <text
                          x="34"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#122359"
                        >
                          68%
                        </text>
                      </svg>
                      <span className="text-[#122359] text-[10px] font-bold leading-tight text-center">
                        صعوبات
                        <br />
                        التعلم
                      </span>
                    </div>
                  </motion.div>

                  {/* Left-mid: التركيز */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'backOut', delay: 0.5 }}
                    className="absolute left-4 top-1/3 z-20"
                  >
                    <div className="bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.10)] flex flex-col items-center gap-1.5">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#fef3c7"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.55) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                          style={{ transformOrigin: '34px 34px', transform: 'rotate(-90deg)' }}
                        />
                        <text
                          x="34"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#122359"
                        >
                          55%
                        </text>
                      </svg>
                      <span className="text-[#122359] text-[10px] font-bold leading-tight text-center">
                        التركيز
                        <br />
                        والانتباه
                      </span>
                    </div>
                  </motion.div>

                  {/* Bottom-right: التعبير العاطفي */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'backOut', delay: 0.7 }}
                    className="absolute right-4 bottom-8 z-20"
                  >
                    <div className="bg-white/95 backdrop-blur-md border border-purple-100 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.10)] flex flex-col items-center gap-1.5">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#ede9fe"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.42) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
                          style={{ transformOrigin: '34px 34px', transform: 'rotate(-90deg)' }}
                        />
                        <text
                          x="34"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#122359"
                        >
                          42%
                        </text>
                      </svg>
                      <span className="text-[#122359] text-[10px] font-bold leading-tight text-center">
                        التعبير
                        <br />
                        العاطفي
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Card 2: Empowerment ── */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                whileHover={{ y: -6 }}
                className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-50 via-[#eaf7f2] to-teal-50 border border-emerald-100/80 shadow-2xl shadow-emerald-200/30 flex flex-col min-h-[560px] group cursor-default"
              >
                <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top text */}
                <div className="p-8 pb-4 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 text-success px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm">
                    <Trophy className="w-3.5 h-3.5" />
                    نتائج مثبتة
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#122359] mb-3 tracking-tight leading-snug">
                    افتح إمكانياته مع توجيه متخصص
                  </h3>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-sm">
                    برامجنا تبني المهارات الجوهرية وتغرس الثقة اللازمة لتحقيق نجاح دائم في مسيرة
                    التعلم.
                  </p>
                </div>

                {/* Image + circular progress badges area */}
                <div className="relative flex-1 flex items-end justify-center overflow-hidden min-h-[280px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-[#a3e4ce]/50 z-0" />

                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0 rotate-[14deg]"
                    viewBox="0 0 400 300"
                  >
                    <motion.path
                      d="M 30,150 A 170,48 0 0,1 370,150"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.6 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
                    />
                  </svg>

                  <Image
                    src="/child_celebrating_success_1782938274929.png"
                    alt="طفل يحتفل بنجاحه"
                    width={320}
                    height={320}
                    className="relative z-10 object-contain drop-shadow-xl group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    style={{ maxHeight: 320 }}
                  />

                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-20 rotate-[14deg]"
                    viewBox="0 0 400 300"
                  >
                    <motion.path
                      d="M 370,150 A 170,48 0 0,1 30,150"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.8 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeInOut', delay: 1.4 }}
                    />
                  </svg>

                  {/* Circular progress badges */}
                  {/* Top-left: الثقة بالنفس 92% */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'backOut', delay: 0.3 }}
                    className="absolute left-4 top-4 z-20"
                  >
                    <div className="bg-white/95 backdrop-blur-md border border-emerald-100 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.10)] flex flex-col items-center gap-1.5">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#d1fae5"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.92) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                          style={{ transformOrigin: '34px 34px', transform: 'rotate(-90deg)' }}
                        />
                        <text
                          x="34"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#122359"
                        >
                          92%
                        </text>
                      </svg>
                      <span className="text-[#122359] text-[10px] font-bold leading-tight text-center">
                        الثقة
                        <br />
                        بالنفس
                      </span>
                    </div>
                  </motion.div>

                  {/* Right-mid: التعلم الذكي 87% */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'backOut', delay: 0.5 }}
                    className="absolute right-4 top-1/3 z-20"
                  >
                    <div className="bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.10)] flex flex-col items-center gap-1.5">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#dbeafe"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.87) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                          style={{ transformOrigin: '34px 34px', transform: 'rotate(-90deg)' }}
                        />
                        <text
                          x="34"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#122359"
                        >
                          87%
                        </text>
                      </svg>
                      <span className="text-[#122359] text-[10px] font-bold leading-tight text-center">
                        التعلم
                        <br />
                        الذكي
                      </span>
                    </div>
                  </motion.div>

                  {/* Bottom-left: الإنجاز 95% */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'backOut', delay: 0.7 }}
                    className="absolute left-4 bottom-8 z-20"
                  >
                    <div className="bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.10)] flex flex-col items-center gap-1.5">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#fef3c7"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.95) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
                          style={{ transformOrigin: '34px 34px', transform: 'rotate(-90deg)' }}
                        />
                        <text
                          x="34"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#122359"
                        >
                          95%
                        </text>
                      </svg>
                      <span className="text-[#122359] text-[10px] font-bold leading-tight text-center">
                        الإنجاز
                        <br />
                        المتسارع
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* ── BOTTOM CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-success to-emerald-500 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-[0_12px_30px_rgba(22,184,138,0.35)] hover:shadow-[0_18px_40px_rgba(22,184,138,0.5)] transition-shadow duration-300"
              >
                ابدأ رحلتك اليوم
                <Rocket className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
