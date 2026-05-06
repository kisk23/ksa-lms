import { User } from 'lucide-react';

interface StudentCourseInfoProps {
  studentName: string;
  studentEmail: string;
  studentIdNumber: string;
  courseName: string;
  amount: number;
  purchaseDate: string;
}

export function StudentCourseInfo({
  studentName,
  studentEmail,
  studentIdNumber,
  courseName,
  amount,
  purchaseDate,
}: StudentCourseInfoProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-surface-container-high">
      <h2 className="font-h2-ar text-h2-ar text-on-surface mb-md flex items-center gap-sm">
        <User className="w-5 h-5 text-primary" />
        معلومات الطالب والدورة
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Student Info */}
        <div className="space-y-sm bg-surface p-sm rounded-lg border border-surface-container">
          <h3 className="font-body-md-ar text-body-md-ar text-on-surface-variant font-semibold border-b border-surface-container-highest pb-xs">
            بيانات الطالب
          </h3>
          <div className="flex flex-col gap-xs font-caption-ar text-caption-ar">
            <div className="flex justify-between">
              <span className="text-outline">الاسم:</span>
              <span className="text-on-surface font-medium">{studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">البريد الإلكتروني:</span>
              <span className="text-on-surface font-medium font-label-en text-label-en">
                {studentEmail}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">رقم الهوية:</span>
              <span className="text-on-surface font-medium font-label-en text-label-en">
                {studentIdNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-sm bg-surface p-sm rounded-lg border border-surface-container">
          <h3 className="font-body-md-ar text-body-md-ar text-on-surface-variant font-semibold border-b border-surface-container-highest pb-xs">
            بيانات الدورة
          </h3>
          <div className="flex flex-col gap-xs font-caption-ar text-caption-ar">
            <div className="flex justify-between">
              <span className="text-outline">الدورة:</span>
              <span className="text-on-surface font-medium">{courseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">سعر الشراء:</span>
              <span className="text-on-surface font-medium">{amount} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">تاريخ الشراء:</span>
              <span className="text-on-surface font-medium font-label-en text-label-en">
                {purchaseDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
