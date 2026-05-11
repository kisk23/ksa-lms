'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [collapse, setCollapse] = useState(false);
  const [collapsActive, setCollapsActive] = useState(false);

  return (

    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <div className="md:w-1/6 w-1/2">
          <Link href="/" className="flex items-center">
            <Image src="/Logo.svg" alt="Logo" width={140} height={40} />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/*collapse button*/}
          <button
            type="button"
            aria-label="Toggle collapse"
            className={`md:hidden p-2 rounded shadow-lg ${
              collapsActive ? 'bg' : ''
            } ${!collapsActive ? 'text-primary' : 'text-secondary'}
                     ${!collapsActive ? 'hover:bg-secondary/80' : 'hover:bg-secondary/20'}
                     transition shadow-md`}
            onClick={() => {
              setCollapse(!collapse);
              setCollapsActive(!collapsActive);
            }}
          >
            <Menu size={18} />
          </button>
        </div>
        {/* Links */}
        <div
          className={`${
            collapse ? 'block' : 'hidden'
          } w-full md:flex md:w-5/6 px-4 flex flex-col md:flex-row md:justify-between`}
        >
          <div className="w-full md:w-4/6 flex lg:justify-center lg:ps-4">
            <ul className="font-medium flex flex-col md:flex-row md:space-x-0 lg:space-x-4 mt-4 md:mt-0">
              <li>
                <Link
                  href="/"
                  className={`block font-semibold text-lg ${
                    pathname === '/' ? ' border-b-2 border-primary' : 'text-gray-500'
                  } hover:text-primary/70 transition`}
                >
                  الرئيسية
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className={`block font-semibold text-lg ${
                    pathname === '/courses' ? ' border-b-2 border-primary' : 'text-gray-500'
                  } hover:text-primary/70 transition`}
                >
                  الدورات
                </Link>
              </li>

              <li>
                <Link
                  href="/teachers"
                  className={`block font-semibold text-lg ${
                    pathname === '/teachers' ? ' border-b-2 border-primary' : 'text-gray-500'
                  } hover:text-primary/70 transition`}
                >
                  المعلمون
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className={`block font-semibold text-lg ${
                    pathname === '/about' ? ' border-b-2 border-primary' : 'text-gray-500'
                  } hover:text-primary/70 transition`}
                >
                  عن سُلَّم
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-2/6 flex items-center md:justify-end lg:gap-4 gap-2 mt-4 md:mt-0">
             <div
          className="flex flex-row-reverse gap-3"
        >
          <button className="font-semibold text-sm bg-primary text-white hover:bg-primary/80 transition-all duration-200 active:scale-95 px-4 py-2 rounded-lg cursor-pointer">
            تسجيل جديد
          </button>
          <button className="font-semibold text-sm text-primary hover:bg-primary/20 transition-all duration-200 active:scale-95 px-4 py-2 rounded-lg border-2 border-[#2446B8] cursor-pointer">
            تسجيل الدخول
          </button>
        </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
