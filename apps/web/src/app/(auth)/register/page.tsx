import type { Metadata } from 'next';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'تسجيل جديد - سُلَّم',
  description: 'أنشئ حسابك في منصة سُلَّم التعليمية',
};

export default function RegisterPage() {
  return (
    <div
      dir="rtl"
      className="w-full min-h-screen flex items-center justify-center p-6 lg:p-0 bg-[#faf8ff]"
    >
      <main className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[921px] rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(22,33,62,0.1)] bg-white">
        {/* ── Form side ── */}
        <section className="lg:w-1/2 p-10 xl:p-16 flex flex-col justify-center overflow-y-auto">
          {/* Brand */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <Image src="/Logo.svg" alt="سُلَّم" width={32} height={32} />
            <span className="text-primary font-bold text-2xl font-arabic">سُلَّم</span>
          </Link>

          <RegisterForm />
        </section>

        {/* ── Decorative panel (desktop only) ── */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#dae1ff] items-center justify-center overflow-hidden">
          {/* Background photo */}
          <div className="absolute inset-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU4MX1NWCytejpB647a7l2d7Ije8Y8UtQ-Ha4FjzG-XdBQ98aFNUsbJIU96JNZ1UhDhU0B_iTzppLm11AUvenXouc0tSEl73XiFjiyDQy4KPBNx9fMxORjZ2TQT0juhePKm509FliZ9kNJExTVjQO5-k7kn1sGMYysdh0z2kvjp4vm3oiu8Gv5xzLcsQ_EGrSqA9oTN3SJzJHAZkOz36C7BVLTJHW90YKx_PawD827PZTVq-p1QUAhEoEtIHnKYWzGFg6X8SMg4uAq"
              alt="طلاب يتعاونون في مكتبة حديثة"
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-[#252f4d]/90 via-[#252f4d]/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-16 text-center max-w-lg">
            <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/30 shadow-lg">
              <GraduationCap className="text-white w-12 h-12" />
            </div>

            <h2 className="text-white font-bold text-[42px] leading-[1.2] font-arabic mb-6">
              ارتقِ بمستواك الأكاديمي
            </h2>
            <p className="text-[#b8c4ff] text-[18px] leading-relaxed font-arabic">
              منصة سُلَّم توفر لك كل ما تحتاجه للتميز في دراستك الثانوية، من دورات مكثفة إلى تقييمات
              مستمرة لضمان تفوقك.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
