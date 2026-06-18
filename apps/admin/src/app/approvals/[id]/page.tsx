'use client';

import {
  ApprovalHeader,
  CourseOverview,
  CurriculumStructure,
  ReviewActionCard,
  StatusTimeline,
} from '@features/approval-management';
import type { ApprovalRequest } from '@features/approval-management';
import { apiClient } from '@shared/lib/api-client';
import { Mail, Phone, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

type ApprovalDetailPageProps = {
  params: { id: string };
};

export default function ApprovalDetailPage({ params }: ApprovalDetailPageProps) {
  const { id } = params;
  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const response = await apiClient.get<ApprovalRequest>(`/approvals/${id}`);
        setApproval(response);
      } catch (err) {
        console.error('Failed to fetch approval detail', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400">جاري التحميل...</div>;
  }

  if (!approval) {
    return <div className="py-24 text-center text-error">لم يتم العثور على الطلب</div>;
  }

  // MOCK or map the timeline and modules if needed
  const modules =
    approval.course?.chapters?.map((ch) => ({
      id: ch.id,
      title: ch.title,
      lessons: ch.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: 'video' as const,
        duration: l.videoDuration
          ? `${Math.floor(l.videoDuration / 60)}:${l.videoDuration % 60}`
          : 'N/A',
      })),
      durationLabel: `${ch.lessons.length} دروس`,
    })) || [];

  const timeline = [
    {
      id: 't1',
      title: 'حالة الطلب الحالية',
      description: approval.status === 'PENDING_REVIEW' ? 'بانتظار المراجعة' : approval.status,
      meta: new Date(approval.updatedAt).toLocaleDateString('ar-SA'),
      status: 'current' as const,
    },
    {
      id: 't2',
      title: 'تاريخ تقديم الطلب',
      description: `بواسطة: ${approval.requester?.name || 'Unknown'}`,
      meta: new Date(approval.createdAt).toLocaleDateString('ar-SA'),
      status: 'past' as const,
    },
  ];

  return (
    <>
      <ApprovalHeader
        title={approval.lesson ? approval.lesson.title : approval.course?.title || 'Unknown'}
        requestNumber={approval.id.split('-')[0].toUpperCase()}
        submittedBy={approval.requester?.name || 'Unknown'}
        status={approval.status}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        {/* Main Column */}
        <div className="xl:col-span-8 flex flex-col gap-gutter">
          <CourseOverview
            imageUrl={
              approval.course?.thumbnailUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDBD6DEZWSUd5atQlVPChj4vBXBFJaqQpm6C5_faZ81PqBhX3JoMomqo_eY2tbgbfWo5_HJSAMGnuwidKJ6NOVlGPi1EWhGzH6fMho4nAZIF6YuEUGu2_bD8uuGRy3dc_szB5U1T8GH90xcYaD7N1g4WifB0CQA5UmN4-qwxIhJW58IQ8yzYNyCWB3TLFvSWF1CENOvnrNI_w_ZOE5CMT6U4Kt3SOeigkFeuj-BAGUkx8wV_4jXUO06F3T2bV7MlWgx2C6d9p2_gV_N'
            }
            duration="غير محدد"
            tags={[]}
            description={approval.course?.description || 'لا يوجد وصف للمقرر'}
          />
          <CurriculumStructure modules={modules} />
          {/* Note: InstructorNotes removed since we removed instructorNote from backend schema */}
        </div>

        {/* Side Column */}
        <div className="xl:col-span-4 flex flex-col gap-gutter">
          <ReviewActionCard approvalId={approval.id} currentStatus={approval.status} />

          {approval.course?.teacher && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md">
              <h3 className="font-h3-ar text-h3-ar text-on-surface mb-4">معلومات المعلم</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <UserIcon size={18} />
                  <span className="font-body-ar text-body-ar">{approval.course.teacher.name}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Mail size={18} />
                  <span className="font-label-en text-label-en">
                    {approval.course.teacher.email}
                  </span>
                </div>
                {approval.course.teacher.phone && (
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Phone size={18} />
                    <span className="font-label-en text-label-en">
                      {approval.course.teacher.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <StatusTimeline entries={timeline} />
        </div>
      </div>
    </>
  );
}
