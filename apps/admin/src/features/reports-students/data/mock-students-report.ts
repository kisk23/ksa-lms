import type { Student, StudentsReportSummary } from '../types';

export const STUDENTS_REPORT_SUMMARY: StudentsReportSummary = {
  avgSessionDuration: '24د 15ث',
  sessionChange: 5.2,
  completionRate: 78,
  liveSessions: 12,
};

export const TOP_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'سارة أحمد',
    studentId: '2023-041',
    course: 'الفيزياء المتقدمة',
    progress: 92,
    lastActivity: 'قبل 10 دقائق',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAk2FPadu0k52luk8_0SlFpyVGw4oTf_4q83T4PxKkrbUf2vCoqeussY0mXWfHHGE1LQMLq2q8JRmAfGZUOV2fuZ0I5X_W_C8o8QEEDSQIWawFW2NqWqNxL2UqDsZ_gf6O23jEqH6mqBJfc52yRcbRxHsoJNByv5TsY075gcct0PmCEMakYwgXoHETURNRfsOuvvxqg0TEJSKrZp4Bfo57VsJ0hNgboSY9z4J3UkuVezk9hXe7J6KeSzCr354I91wpsC9G730cd9tk1',
    initials: 'س',
    courseBadgeColor: '#0EA5E9',
  },
  {
    id: 'student-2',
    name: 'عمر خالد',
    studentId: '2023-112',
    course: 'الرياضيات 3',
    progress: 85,
    lastActivity: 'قبل ساعة',
    initials: 'ع',
    courseBadgeColor: '#2563EB',
  },
  {
    id: 'student-3',
    name: 'محمد عبدالله',
    studentId: '2023-089',
    course: 'علم الأحياء',
    progress: 78,
    lastActivity: 'اليوم 09:30 ص',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAX8IxJ-YC_lHGLA6hIMqLcRRR0VUTIpbFEWspFBF7sKUDtDlpa6LE4SnG6HIa-Yx_W6EeWnL42lIvrszhF7Hl9S5rqkmnL5EJmutqTqX8Xk-v7BcXsXiL1rwq5wdQ4Fi2k3YBIwxjuzlUMffgKazfHQ9N33NB3enEaM5onCjAYYh6TwgSktM_-r0F3t-pUcVO5_Uu-c1xk4fkRGChbnDQgxxTS0hyrLf7H_y0bZDD6YBCbXRYYE-TMq2Yz9aX6DB9kkMbvvEU5ufLs',
    initials: 'م',
    courseBadgeColor: '#059669',
  },
];
