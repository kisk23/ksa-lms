import type { Teacher, TeachersReportSummary } from '../types';

export const TEACHERS_REPORT_SUMMARY: TeachersReportSummary = {
  totalTeachers: 24,
  averageRating: 4.5,
  topEarner: 45200,
  totalStudents: 3075,
};

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'أ. أحمد محمد',
    subject: 'math',
    subjectAr: 'الرياضيات',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAH9RozwfHEAtNRGWoCcWCyjiKjESl8ccKee9GrjqFm-fhbcnot8KBcWPn4ERYePFH4M1JXkBSn9plMtxVv4zcPaqW7EcsXgpM5Ev-HvuWsRBZHsdQwzH82XkIcAERghKyuFTyBw7744MS-7DaBYB8BYHxrDmgWiMgFb4e960wqBiGZuVVyxoMXQKyvWlOBjjOTY3Cullv-nnMoxOmGqfQQq_geLSM1xe-8aHaY3TtMzfZWvHTa9jvFXNEIdNuuvhD-n4IVrG1TXH9l',
    studentCount: 1245,
    rating: 4.8,
    totalEarnings: 45200,
    rank: 1,
  },
  {
    id: '2',
    name: 'أ. سارة خالد',
    subject: 'physics',
    subjectAr: 'الفيزياء',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUqB4VPWZ-5TWKbtiz8YFyKNO_GWuVZFpNS-T2B348bX3wnGO2ax9Xu4PPIehW-R8HpeH031Ctz2qtrQRUjmZa0HvHWvjRQR67id0ZxKhpJO30DmMzuzX29cAdCpOPe5JGWiexwayv3UyS_sOymp5FTeFVFAN0woFwlZQQLTEYvrArBQWJzcESHmOV8FsPO7ApFOe6bZtG06AmGWNcP3GRPuM-f4J9ir8zpBOPOHsNMjzkBGy5IwmLVGCFag88g17ON10rvGa59ej',
    studentCount: 980,
    rating: 4.9,
    totalEarnings: 38500,
    rank: 2,
  },
  {
    id: '3',
    name: 'أ. عمر زيد',
    subject: 'arabic',
    subjectAr: 'اللغة العربية',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ036oPgC6YskmhVNyHoESWldWmfheaNUue_a9VEJgRD70L8j-95gQzI2Y0iaNsKz5B6oQAPcno-r7B9vc0m1vt9__PxXmpjQVxtoVhBxfJcbWh40NV7pWFKABu-cI-egkRvysR83xlrUKDF-vf6vuDym56GDkkc4KWnBAeI1Nj8gCTGazves27f7aWqkOwoXJdiVSMXoFkyjBl6MMkUqP65EJaog79OgcyEA7Ysbb3kx9XOp85Ji1aoFLyEGcTH9jWxx6nOqdFNjK',
    studentCount: 850,
    rating: 4.2,
    totalEarnings: 29100,
    rank: 3,
  },
];
