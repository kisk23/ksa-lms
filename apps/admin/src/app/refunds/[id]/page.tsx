'use client';

import {
  RefundDetailHeader,
  StudentCourseInfo,
  PaymentRefundDetails,
  RefundDecisionForm,
  RefundTimeline,
  getRefundById,
} from '@features/refunds';
import { useParams, useRouter } from 'next/navigation';

export default function RefundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const refund = getRefundById(id);

  if (!refund) {
    return (
      <div className="p-margin flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="font-h2-ar text-h2-ar text-on-surface mb-2">الطلب غير موجود</h2>
          <p className="text-on-surface-variant mb-4">لم نتمكن من العثور على هذا الطلب</p>
          <button onClick={() => router.push('/refunds')} className="text-primary hover:underline">
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = (_reason: string) => {
    // TODO: Implement approval logic
    if (confirm('هل أنت متأكد من قبول الطلب وإرجاع المبلغ؟')) {
      alert('تم قبول الطلب بنجاح وسيتم إرجاع المبلغ للطالب');
      router.push('/refunds');
    }
  };

  const handleReject = (reason: string) => {
    if (!reason.trim()) {
      alert('يرجى كتابة سبب الرفض');
      return;
    }

    // TODO: Implement rejection logic
    if (confirm('هل أنت متأكد من رفض الطلب؟')) {
      alert('تم رفض الطلب');
      router.push('/refunds');
    }
  };

  return (
    <main className="flex-1 overflow-y-auto w-full max-w-[1280px] mx-auto p-margin md:p-xl">
      <RefundDetailHeader requestNumber={refund.requestNumber} status={refund.status} />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Details (span 8) */}
        <div className="lg:col-span-8 space-y-gutter">
          <StudentCourseInfo
            studentName={refund.studentName}
            studentEmail={refund.studentEmail}
            studentIdNumber={refund.studentIdNumber}
            courseName={refund.courseName}
            amount={refund.amount}
            purchaseDate={refund.purchaseDate}
          />

          <PaymentRefundDetails
            paymentMethod={refund.paymentMethod}
            transactionId={refund.transactionId}
            reason={refund.reason}
          />

          {refund.status === 'pending' && (
            <RefundDecisionForm onApprove={handleApprove} onReject={handleReject} />
          )}
        </div>

        {/* Right Column: Timeline (span 4) */}
        <div className="lg:col-span-4">
          <RefundTimeline events={refund.timeline} />
        </div>
      </div>
    </main>
  );
}
