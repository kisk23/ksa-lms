import { CreateCourseForm } from '@features/course-management/components/CreateCourseForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء دورة جديدة - لوحة الإدارة',
  description: 'إضافة كورس تعليمي جديد وتعيين معلم ومحتوى ترويجي في منصة سلَّم',
};

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CreateCourseForm />
      </div>
    </div>
  );
}
