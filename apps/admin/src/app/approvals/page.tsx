'use client';

import { ApprovalsHeader, ApprovalsFilters, ApprovalsTable } from '@features/approval-management';
import type {
  ApprovalStatus,
  ApprovalStatusFilter,
  ApprovalListItem,
  ApprovalRequest,
} from '@features/approval-management';
import { apiClient } from '@shared/lib/api-client';
import { useState, useEffect } from 'react';

export default function ApprovalsPage() {
  const [status, setStatus] = useState<ApprovalStatusFilter>('all');
  const [approvals, setApprovals] = useState<ApprovalListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovals() {
      try {
        setLoading(true);
        // Map 'all' to undefined for the API, otherwise pass the status
        const queryParams = status === 'all' ? '' : `?status=${status}`;
        const response = await apiClient.get<{ data: ApprovalRequest[]; meta: unknown }>(
          `/approvals${queryParams}`,
        );

        // Map the backend ApprovalRequest to the frontend ApprovalListItem format
        const mapped: ApprovalListItem[] = response.data.map((req) => ({
          id: req.id,
          requestType: req.requestType,
          teacherName: req.requester?.name || 'Unknown',
          teacherInitials: req.requester?.name?.substring(0, 2).toUpperCase() || 'NA',
          courseOrLessonName: req.lesson ? req.lesson.title : req.course?.title || 'Unknown',
          requestDate: new Date(req.createdAt).toLocaleDateString('ar-SA'),
          status: req.status,
        }));

        setApprovals(mapped);
      } catch (err) {
        console.error('Failed to fetch approvals', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApprovals();
  }, [status]);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus as ApprovalStatus } : app)),
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-lg">
      <div className="flex flex-col gap-md">
        <ApprovalsHeader />
        <ApprovalsFilters status={status} onStatusChange={setStatus} />
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">جاري التحميل...</div>
      ) : (
        <ApprovalsTable approvals={approvals} onStatusUpdate={handleStatusUpdate} />
      )}
    </div>
  );
}
