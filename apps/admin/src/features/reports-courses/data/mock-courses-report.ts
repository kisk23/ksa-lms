import type { Course, CourseReportSummary, TopCourse } from '../types';

export const COURSES_REPORT_SUMMARY: CourseReportSummary = {
  totalCoursesSold: 12450,
  averagePrice: 199,
  priceChange: 5,
  totalRevenue: 2476050,
  revenueChange: 12,
};

export const TOP_COURSES: TopCourse[] = [
  {
    title: 'أساسيات التفاضل والتكامل',
    studentCount: 450,
    percentage: 100,
  },
  {
    title: 'مقدمة في الفيزياء الحديثة',
    studentCount: 380,
    percentage: 85,
  },
  {
    title: 'قواعد اللغة الإنجليزية المتقدمة',
    studentCount: 310,
    percentage: 68,
  },
  {
    title: 'برمجة بايثون للمبتدئين',
    studentCount: 250,
    percentage: 55,
  },
  {
    title: 'تاريخ المملكة العربية السعودية',
    studentCount: 190,
    percentage: 42,
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'أساسيات التفاضل والتكامل',
    category: 'math',
    categoryAr: 'الرياضيات',
    instructor: 'د. طارق الهاشمي',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6l13VXZBXe33c9eFAjgaR1ESL9oR0Vw1A66Jtx0LUZ-b2phlcGdSZZZEVlsxT6hGnU8HwZRfrarCT9muU263xa8eaBUkRnhtbPQPNeOpD0J9DXDQPAPtMCVkF6fp_IifFDLtQJB9LSKSv7qUx80DjRuZoM1q-Zg8bTIg8-IrAcdleXkrRHf10Xr0bAXOMEZMi3JP_toeE-5kVHmcwYWcWJKQAYZqhUaxrc4iSZhDO0wJge0SW5VGUhRzOQWf2qUYIkpSJS3Wy6CeS',
    studentCount: 450,
    totalRevenue: 89550,
    pricePerStudent: 199,
  },
  {
    id: '2',
    title: 'مقدمة في الفيزياء الحديثة',
    category: 'science',
    categoryAr: 'العلوم',
    instructor: 'أ. سارة المنيع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqDJP57IT3T7jMlVK34brWtUctVXunntcCJVRGlej_gB57uRUnZ529dYU6qAM2cacZo6Tqb7DGlvfIud2ohH7WXeLvLHDcsDI331UTZTy6xR-fMm390uPosTBeJ3R4yQnRMN1ysUMb9j4X10tKTgA5g1XNN-EWYwllSF6MH696EDK9jE_-KSBF7M3UgaFXMu5FFnkAMAflwae3gFbudpP4zjNdgmh5EodKrTAbGzwjghL5GWiqibP2mNY5neqYrnlAWeml3Hx_i4Tr',
    studentCount: 380,
    totalRevenue: 75620,
    pricePerStudent: 199,
  },
  {
    id: '3',
    title: 'قواعد اللغة الإنجليزية المتقدمة',
    category: 'english',
    categoryAr: 'اللغة الإنجليزية',
    instructor: 'د. ريتشارد جونز',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfsOXAhOj58dOUWxiAUWJGwYwmEx7KOumTsW92DqVeMV071zt7-6Ug-oucbcvyQtm94Rdc_PTPgPEW6btC5xPlEqXBed3tHYVBr8V0gzoQESGQzbx9a6jr6p8jUdcHO5_uoZzI8ofYYmOcwyXHx9ogrtgmHaIHNow4COozdCK06y4t25sBTDUj4p7NYJdjtQwRxy6CuMkNI9ax_fm5kCBxiHoH_EAd8kxLX_IC43KhAJSVTvpdhth-g5IeRsK4J9exarVpgGVTzDf7',
    studentCount: 310,
    totalRevenue: 46190,
    pricePerStudent: 149,
  },
  {
    id: '4',
    title: 'برمجة بايثون للمبتدئين',
    category: 'computer',
    categoryAr: 'الحاسب الآلي',
    instructor: 'م. أحمد الدوسري',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-4GtVkfIEL394fYriBCwXFjUQjqTm6XNkLP_PGyu31NJgwXRVu5AEJvJjeny_JRbiM9q0Jvzc_dUPlEb3VlFE2JIki8xSblYuzEcvTUa7CLHaPGffeeuxodRuZajHPwwXDdnkX5x9jtPCcWMWjohRhh5AYfEm0oFGt2LWwvojOqsQymfuQ0fESoaUINm5VANePWGf3ONk6yVls8d6wlg35NYRzazicV9O-ULKi-YMN8TNaM86TGSH548RL94HtgGXLMN_PRJi53-Q',
    studentCount: 250,
    totalRevenue: 49750,
    pricePerStudent: 199,
  },
  {
    id: '5',
    title: 'تاريخ المملكة العربية السعودية',
    category: 'social',
    categoryAr: 'الاجتماعيات',
    instructor: 'أ. فهد المطيري',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_dyLF6Wntn1WFe67NxCLdmHDg9ec89U7aXlfOOch_0j882rn4XfzQvQlDwfnhnrdnOrWYj0xiKpTJj1GKj4F4XfQhODKrPdSav8CsmuSPN7vQAVD6jZC5hNISTUIuPe68UYHvR3Nksydv4Ggk5FN3xDymqSHdDm6nEKt12M_AEA3f4eLUY3r-qGh9nAN0Ia5PWCz0ih6n5mxocFXBxVL8hhMtm9ES0u3mh6ZsklMh_9iEUHmjex7V_gIka-S1QzFyS_uJm6iuloTg',
    studentCount: 190,
    totalRevenue: 28310,
    pricePerStudent: 149,
  },
];
