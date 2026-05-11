import type { ApprovalListItem, ApprovalRequest } from '../types';

// === LIST DATA ===

export const MOCK_APPROVALS_LIST: ApprovalListItem[] = [
  {
    id: '8492',
    requestType: 'new_course',
    teacherName: 'أحمد محمد',
    teacherInitials: 'أ.م',
    courseOrLessonName: 'أساسيات الفيزياء الحديثة',
    requestDate: '15 أكتوبر 2023',
    status: 'pending_review',
  },
  {
    id: '8491',
    requestType: 'edit_course',
    teacherName: 'سارة علي',
    teacherInitials: 'س.ع',
    courseOrLessonName: 'مقدمة في الكيمياء العضوية',
    requestDate: '14 أكتوبر 2023',
    status: 'approved',
  },
  {
    id: '8490',
    requestType: 'new_lesson',
    teacherName: 'خالد عبدالله',
    teacherInitials: 'خ.ع',
    courseOrLessonName: 'تطبيقات التفاضل والتكامل',
    requestDate: '12 أكتوبر 2023',
    status: 'changes_requested',
  },
  {
    id: '8489',
    requestType: 'new_course',
    teacherName: 'فاطمة الزهراء',
    teacherInitials: 'ف.ز',
    courseOrLessonName: 'اللغة العربية - النحو',
    requestDate: '10 أكتوبر 2023',
    status: 'pending_review',
  },
  {
    id: '8488',
    requestType: 'edit_course',
    teacherName: 'محمود حسن',
    teacherInitials: 'م.ح',
    courseOrLessonName: 'الإحصاء التطبيقي',
    requestDate: '08 أكتوبر 2023',
    status: 'rejected',
  },
  {
    id: '8487',
    requestType: 'new_lesson',
    teacherName: 'نورة الشمري',
    teacherInitials: 'ن.ش',
    courseOrLessonName: 'البرمجة بلغة بايثون',
    requestDate: '05 أكتوبر 2023',
    status: 'approved',
  },
  {
    id: '8486',
    requestType: 'new_course',
    teacherName: 'عمر الشهري',
    teacherInitials: 'ع.ش',
    courseOrLessonName: 'تاريخ الحضارة الإسلامية',
    requestDate: '03 أكتوبر 2023',
    status: 'pending_review',
  },
  {
    id: '8485',
    requestType: 'edit_course',
    teacherName: 'ليلى الحربي',
    teacherInitials: 'ل.ح',
    courseOrLessonName: 'اللغة الإنجليزية - المحادثة',
    requestDate: '01 أكتوبر 2023',
    status: 'changes_requested',
  },
  {
    id: '8484',
    requestType: 'new_lesson',
    teacherName: 'ياسر الغامدي',
    teacherInitials: 'ي.غ',
    courseOrLessonName: 'تصميم واجهات المستخدم',
    requestDate: '28 سبتمبر 2023',
    status: 'pending_review',
  },
  {
    id: '8483',
    requestType: 'new_course',
    teacherName: 'هدى المنصور',
    teacherInitials: 'ه.م',
    courseOrLessonName: 'علم الأحياء الدقيقة',
    requestDate: '25 سبتمبر 2023',
    status: 'approved',
  },
  {
    id: '8482',
    requestType: 'edit_course',
    teacherName: 'بدر العنزي',
    teacherInitials: 'ب.ع',
    courseOrLessonName: 'الجغرافيا الطبيعية',
    requestDate: '22 سبتمبر 2023',
    status: 'pending_review',
  },
  {
    id: '8481',
    requestType: 'new_lesson',
    teacherName: 'ريم الزهراني',
    teacherInitials: 'ر.ز',
    courseOrLessonName: 'أساسيات التسويق الرقمي',
    requestDate: '20 سبتمبر 2023',
    status: 'rejected',
  },
];

// === DETAIL DATA ===

export const MOCK_APPROVAL: ApprovalRequest = {
  id: '8492',
  requestNumber: 'REQ-8492',
  courseTitle: 'مقدمة في الفيزياء الكمية',
  submittedBy: 'د. طارق عبدالرحمن',
  status: 'pending_review',
  previewImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDBD6DEZWSUd5atQlVPChj4vBXBFJaqQpm6C5_faZ81PqBhX3JoMomqo_eY2tbgbfWo5_HJSAMGnuwidKJ6NOVlGPi1EWhGzH6fMho4nAZIF6YuEUGu2_bD8uuGRy3dc_szB5U1T8GH90xcYaD7N1g4WifB0CQA5UmN4-qwxIhJW58IQ8yzYNyCWB3TLFvSWF1CENOvnrNI_w_ZOE5CMT6U4Kt3SOeigkFeuj-BAGUkx8wV_4jXUO06F3T2bV7MlWgx2C6d9p2_gV_N',
  previewDuration: '12:45',
  tags: ['فيزياء', 'المرحلة الثانوية - مسار العلوم', 'فصل دراسي أول'],
  description:
    'يهدف هذا المقرر إلى تقديم المفاهيم الأساسية للفيزياء الكمية بطريقة مبسطة وتفاعلية تناسب طلاب المرحلة الثانوية. يتضمن شروحات مرئية، أمثلة من الحياة الواقعية، وتجارب محاكاة افتراضية لتعزيز الفهم العميق للظواهر المعقدة.',
  modules: [
    {
      id: 'm1',
      title: 'الوحدة الأولى: نشأة ميكانيكا الكم',
      durationLabel: '3 دروس • 45 دقيقة',
      lessons: [
        { id: 'l1', title: 'قصة الكارثة فوق البنفسجية', type: 'video', duration: '15:20' },
        { id: 'l2', title: 'فرضية بلانك لتكميم الطاقة', type: 'video', duration: '12:10' },
        { id: 'l3', title: 'واجب تفاعلي: حساب طاقة الكم', type: 'assignment', duration: 'مهمة' },
      ],
    },
    {
      id: 'm2',
      title: 'الوحدة الثانية: التأثير الكهروضوئي',
      durationLabel: '2 دروس • 30 دقيقة',
      lessons: [
        { id: 'l4', title: 'تفسير أينشتاين للتأثير الكهروضوئي', type: 'video', duration: '20:00' },
      ],
    },
  ],
  instructorNote:
    "تم تحديث الوحدة الأولى لتبسيط مفهوم 'الجسم الأسود' بناءً على ملاحظات الطلاب في الفصل الماضي. أضفت محاكاة تفاعلية في نهاية الدرس الثاني ليتمكن الطلاب من تجربة تغيير الترددات ومراقبة التأثير.",
  timeline: [
    {
      id: 't1',
      title: 'قيد المراجعة الإدارية',
      description: 'بواسطة: أحمد الإداري',
      meta: 'اليوم، 10:30 صباحاً',
      status: 'current',
    },
    {
      id: 't2',
      title: 'تم تحديث المحتوى',
      description: 'بواسطة: د. طارق عبدالرحمن',
      meta: 'الأمس، 14:15 مساءً',
      status: 'past',
    },
    {
      id: 't3',
      title: 'طلب تعديلات (سابق)',
      description: 'مطلوب توضيح إضافي في الوحدة الأولى.',
      meta: '12 أكتوبر 2023، 09:00 صباحاً',
      status: 'past',
    },
    {
      id: 't4',
      title: 'تم تقديم الطلب',
      description: 'بواسطة: د. طارق عبدالرحمن',
      meta: '10 أكتوبر 2023',
      status: 'past',
    },
  ],
};

export function getApprovalById(_id: string): ApprovalRequest | null {
  // For demo, return same mock for any id
  return MOCK_APPROVAL;
}

export function getPendingApprovalsCount(): number {
  return MOCK_APPROVALS_LIST.filter((a) => a.status === 'pending_review').length;
}
