'use client';

import {
  ApprovalsHeader,
  ApprovalsFilters,
  ApprovalsTable,
  MOCK_APPROVALS_LIST,
} from '@features/approval-management';
import type { ApprovalStatusFilter } from '@features/approval-management';
import { useState, useMemo } from 'react';

export default function ApprovalsPage() {
  const [status, setStatus] = useState<ApprovalStatusFilter>('all');

  const filteredApprovals = useMemo(() => {
    if (status === 'all') return MOCK_APPROVALS_LIST;
    return MOCK_APPROVALS_LIST.filter((a) => a.status === status);
  }, [status]);

  return (
    <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-lg">
      <div className="flex flex-col gap-md">
        <ApprovalsHeader />
        <ApprovalsFilters status={status} onStatusChange={setStatus} />
      </div>

      <ApprovalsTable approvals={filteredApprovals} />
    </div>
  );
}
