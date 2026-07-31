import type { Teacher } from '@lms/shared-types/src/models/index.ts';

const mockTeachers: Teacher[] = [
  {
    id: 'tariq-abdulrahman',
    name: 'د. طارق عبدالرحمن',
    title: 'دكتوراة في الفيزياء الكمية، خبرة ١٥ عاماً',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyZwoD1aF2lsDcbreVrercD414XJIRUFWhUAr03O-ZwQyl3Y4wvHg4TdnOSGmkX4rRYqVW9Nixwf2EyBRwrQpihySV3Ri8jT0XHvzxOauFs8jriWUfmFOCUqPkyyDL_DtltievflfS0scO5dJmSVnlDGXZLIvulGFRIsGNBW_8vSx-Y4gN3v8H0x8JmI5mXb0Nez42tXPTaCk_EZ8AlkUoRgj7PJkORJTDdK5f6B9V1GX-zCmxcd5G6BljYWLR4mBwnwPpr-zO9gu0',
    rating: 4.9,
    studentsCount: 1200,
    subjectId: 'physics',
    subjectLabel: 'فيزياء',
  },
  {
    id: 'noura-alsalem',
    name: 'أ. نورة السالم',
    title: 'ماجستير طرق تدريس العلوم، مبسطة للمناهج',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB__RKG4V-acUaQ7C75aCiiFKYr0m6GXBf2yIQ0CWaeIEAIgeaoNfsgBuiHCSlINIVtlTYFU1rMNcaNmNkxIr4CbDie-t8cMk7z8n17NTNp2b89vvlrXfjTN7DGgU5CP-8Pwpez9kpmA7bzgNuB0-KJc5CVlwY_q3gWd6-yBVBl8YgjBCvDf7SepXaQpfqRyw6pAnijeTd5I5dFcUt55G4qP4erc9iIf0WzJZQwZsjh_kf3nifB-7WaoYG8XTC62_4uGIwQsmQgeSov',
    rating: 4.8,
    studentsCount: 850,
    subjectId: 'physics',
    subjectLabel: 'فيزياء',
  },
  {
    id: 'khalid-almutairi',
    name: 'أ. خالد المطيري',
    title: 'خبير اختبارات التحصيلي، مؤسس أكاديمية',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvN3DnxaWQoVqpAirRf6XGml67d-Vi0LUHMYH02c1TUJrSXk0i9KGdM5r0qhMy3NFgBQ3xcPwOmXSGFEDbJZtGArsBWZKI8i24zFwhfByPQIyAPaHjykNyQrXeg7L1OsuGi6pQIPYnR0SjW6ci_QK6OYfDbKGJp34HvZEQV-HpxwAY7R_yb5FU51C_PrKBbNVTjvOdUb52M8CvRv3sxaXwIvsl9SXkxkIsHhrOM7y3jJvIk1pzNVdptGcogmYTVliBeG8y2_VDDVRt',
    rating: 4.9,
    studentsCount: 2100,
    subjectId: 'physics',
    subjectLabel: 'فيزياء',
  },
  {
    id: 'rayan-aldosari',
    name: 'م. ريان الدوسري',
    title: 'مهندس فيزيائي، يربط النظريات بالواقع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKNKUNGUQOM4h-8sAnykjLTNurs6TT-yplx_MyhwDh60QywdtGGTk75TdninWZGyc9hhjem_ugKfkO95iYgeduD1fQPVmn16SnKdh5-7ZLqa-rmNYFEmyGi6q8VezOSf9yJI69sYSFaX1OjSXy1aePA8C01t75cSXkfxHeqTLjO9jbjAbdpGOMcCl3p9JUNnHDSixoHqQqF09bnzRk1RdCR5VS4jAS0nFq3nQeHwTAg1DBrVL7q63sUSBhSIjGk4kmYxu5MdqQTUH8',
    rating: 4.7,
    studentsCount: 450,
    subjectId: 'physics',
    subjectLabel: 'فيزياء',
  },
  {
    id: 'sara-alqahtani',
    name: 'أ. سارة القحطاني',
    title: 'معلمة رياضيات معتمدة، متخصصة في القدرات',
    rating: 4.6,
    studentsCount: 620,
    subjectId: 'math',
    subjectLabel: 'رياضيات',
  },
];

/**
 * Simulates a network request for teachers of a given subject.
 * Swap the body of this function for a real API call
 * (e.g. `fetch(\`/api/subjects/\${subjectId}/teachers\`)`) when the
 * backend is ready — the rest of the app only depends on this signature.
 */
export function getTeachersBySubject(subjectId: string): Promise<Teacher[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTeachers.filter((teacher) => teacher.subjectId === subjectId));
    }, 600);
  });
}
