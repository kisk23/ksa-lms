import type { StudyStage } from '@/features/subjects/types/study';

export const studyStages: StudyStage[] = [
  {
    id: 'primary',
    name: 'الابتدائية',
    description: 'تأسيس قوي في كافة المواد الأساسية',
    subjects: [
      { id: 'quran', name: 'القرآن الكريم', teacherCount: 42 },
      { id: 'arabic-language', name: 'لغتي', teacherCount: 58 },
      { id: 'math', name: 'الرياضيات', teacherCount: 71 },
      { id: 'science', name: 'العلوم', teacherCount: 39 },
      { id: 'art', name: 'التربية الفنية', teacherCount: 17 },
    ],
  },
  {
    id: 'middle',
    name: 'المتوسطة',
    description: 'تطوير المهارات العلمية واللغوية',
    subjects: [
      { id: 'math', name: 'الرياضيات', teacherCount: 64 },
      { id: 'science', name: 'العلوم', teacherCount: 47 },
      { id: 'english', name: 'اللغة الإنجليزية', teacherCount: 53 },
      { id: 'social-studies', name: 'الاجتماعيات', teacherCount: 28 },
      { id: 'arabic', name: 'اللغة العربية', teacherCount: 61 },
      { id: 'computer', name: 'الحاسب الآلي', teacherCount: 22 },
    ],
  },
  {
    id: 'secondary',
    name: 'الثانوية',
    description: 'تخصصات علمية وأدبية مكثفة',
    subjects: [
      { id: 'math', name: 'الرياضيات', teacherCount: 89 },
      { id: 'physics', name: 'الفيزياء', teacherCount: 55 },
      { id: 'chemistry', name: 'الكيمياء', teacherCount: 48 },
      { id: 'biology', name: 'الأحياء', teacherCount: 41 },
      { id: 'computer', name: 'الحاسب الآلي', teacherCount: 30 },
      { id: 'english', name: 'اللغة الإنجليزية', teacherCount: 67 },
      { id: 'aptitude', name: 'القدرات', teacherCount: 74 },
      { id: 'achievement', name: 'التحصيلي', teacherCount: 52 },
    ],
  },
];
