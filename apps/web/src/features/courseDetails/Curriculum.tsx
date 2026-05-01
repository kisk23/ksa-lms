'use client';

import { ChevronDown, ChevronRight, CirclePlay } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
  title: string;
  duration: string;
}

interface Module {
  id: number;
  title: string;
  meta: string;
  lessons: Lesson[];
}

const modules: Module[] = [
  {
    id: 1,
    title: 'الوحدة الأولى: أساسيات الميكانيكا',
    meta: '4 دروس • 45 دقيقة',
    lessons: [
      { title: 'مقدمة في علم الحركة', duration: '10:20' },
      { title: 'قوانين نيوتن الثلاثة', duration: '15:45' },
      { title: 'تطبيقات عملية على الحركة', duration: '12:00' },
      { title: 'اختبار الوحدة الأولى', duration: '07:00' },
    ],
  },
  {
    id: 2,
    title: 'الوحدة الثانية: الطاقة والشغل',
    meta: '3 دروس • 35 دقيقة',
    lessons: [
      { title: 'مفهوم الشغل والطاقة', duration: '11:30' },
      { title: 'قانون حفظ الطاقة', duration: '13:00' },
      { title: 'اختبار الوحدة الثانية', duration: '10:30' },
    ],
  },
  {
    id: 3,
    title: 'الوحدة الثالثة: الكهرومغناطيسية',
    meta: '5 دروس • 60 دقيقة',
    lessons: [
      { title: 'المجال الكهربائي', duration: '14:00' },
      { title: 'الدوائر الكهربائية البسيطة', duration: '12:00' },
      { title: 'المجال المغناطيسي', duration: '11:00' },
      { title: 'تطبيقات الكهرومغناطيسية', duration: '13:00' },
      { title: 'اختبار الوحدة الثالثة', duration: '10:00' },
    ],
  },
];

export default function Curriculum() {
  const [openModule, setOpenModule] = useState<number>(1);

  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold text-black/80 mb-6">محتوى الدورة</h2>
      <div className="flex flex-col gap-3">
        {modules.map((mod) => {
          const isOpen = openModule === mod.id;
          return (
            <div key={mod.id} className="border-2 rounded-lg overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setOpenModule(isOpen ? 0 : mod.id)}
                className={`w-full flex justify-between items-center p-4 bg-surface/5 hover:bg-surface/10 transition-colors cursor-pointer text-right ${isOpen ? 'bg-surface/20' : ''}`}
              >
                <div className="flex items-center gap-3 text-black/80">
                  <span className={`text-${isOpen ? 'primary' : 'gray-500'}`}>
                    {isOpen ? <ChevronDown /> : <ChevronRight />}
                  </span>
                  <h3 className="font-semibold  text-base">{mod.title}</h3>
                </div>
                <span className="text-xs text-gray-700 shrink-0 mr-2">{mod.meta}</span>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className="border-t p-4 flex flex-col gap-1">
                  {mod.lessons.map((lesson, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-surface/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3 text-gray-600 group-hover:text-primary transition-colors">
                        <CirclePlay size={18} />
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
