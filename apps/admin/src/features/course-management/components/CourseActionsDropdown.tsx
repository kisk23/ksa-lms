import { ConfirmToast } from '@shared/components/ConfirmToast';
import { DropdownItem } from '@shared/components/ui/DropdownItem';
import { apiClient } from '@shared/lib/api-client';
import {
  Eye,
  Pencil,
  Upload,
  Archive,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MoreVertical,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import type { CourseCardProps } from '../types';

export function CourseActionsDropdown({ course, onRefresh }: CourseCardProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    if (action === 'delete') {
      const confirmResult = await new Promise((resolve) => {
        toast.custom((t) => (
          <ConfirmToast
            t={t}
            title="حذف الدورة"
            message="هل أنت متأكد أنك تريد حذف هذه الدورة نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
            onConfirm={() => resolve(true)}
            onCancel={() => resolve(false)}
          />
        ));
      });

      if (!confirmResult) {
        return;
      }
    }

    setDropdownOpen(false);

    if (action === 'delete') {
      const deletePromise = apiClient.delete(`/courses/${course.id}`);
      toast.promise(deletePromise, {
        loading: 'جاري حذف الدورة...',
        success: 'تم حذف الدورة بنجاح',
        error: 'حدث خطأ أثناء الحذف',
      });
      try {
        await deletePromise;
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error('Delete error', err);
      }
      return;
    }

    setLoadingAction(action);
    const toastId = toast.loading('جاري المعالجة...');
    try {
      if (action === 'publish') {
        await apiClient.patch(`/courses/${course.id}/publish`, {});
        toast.success('تم نشر الدورة بنجاح.', { id: toastId });
      } else if (action === 'archive') {
        await apiClient.patch(`/courses/${course.id}/archive`, {});
        toast.success('تم أرشفة الدورة بنجاح.', { id: toastId });
      } else if (action === 'restore') {
        await apiClient.patch(`/courses/${course.id}/restore`, {});
        toast.success('تم استعادة الدورة بنجاح.', { id: toastId });
      } else if (action === 'submit_review') {
        await apiClient.post('/approvals', {
          requestType: 'NEW_COURSE',
          courseId: course.id,
        });
        toast.success('تم تقديم الدورة للمراجعة بنجاح.', { id: toastId });
      } else if (action === 'request_changes') {
        await apiClient.patch(`/courses/${course.id}`, {
          status: 'CHANGES_REQUESTED',
        });
        toast.success('تم طلب تعديلات على الدورة التدريبية.', { id: toastId });
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error(`Failed to perform course action ${action}:`, err);
      toast.error((err as Error).message || 'حدث خطأ أثناء تنفيذ الإجراء.', { id: toastId });
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !loadingAction && setDropdownOpen(!dropdownOpen)}
        disabled={loadingAction !== null}
        className="text-primary-container font-bold text-sm hover:bg-primary-fixed px-4 py-2 rounded-lg transition-colors border border-primary-container/10 flex items-center gap-1.5 active:scale-95 duration-100 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
      >
        {loadingAction ? (
          <span className="flex items-center gap-1.5">
            جاري...
            <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </span>
        ) : (
          <>
            <span>إدارة</span>
            <MoreVertical size={14} className="opacity-70" />
          </>
        )}
      </button>

      {/* Absolute Actions Menu */}
      {dropdownOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-outline-variant p-2 z-50 flex flex-col gap-1 transition-all animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-2 py-1 text-xs text-on-surface-variant border-b border-surface-container mb-1 font-caption-ar">
            الخيارات المتاحة
          </div>

          {course.status === 'DRAFT' && (
            <>
              <DropdownItem
                icon={Eye}
                label="عرض الكورس"
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/courses/${course.id}`,
                    '_blank',
                  )
                }
              />
              <DropdownItem
                icon={Pencil}
                label="تعديل البيانات"
                onClick={() => router.push(`/courses/${course.id}`)}
              />
              <DropdownItem
                icon={Upload}
                label="تقديم للمراجعة"
                hoverClass="hover:bg-blue-50 hover:text-blue-700"
                onClick={() => handleAction('submit_review')}
              />
              <DropdownItem
                icon={Archive}
                label="أرشفة الكورس"
                hoverClass="hover:bg-red-50 hover:text-red-700"
                onClick={() => handleAction('archive')}
              />
              <DropdownItem
                icon={Archive}
                label="حذف نهائي"
                hoverClass="hover:bg-red-100 hover:text-red-800 font-bold"
                onClick={() => handleAction('delete')}
              />
            </>
          )}

          {course.status === 'PENDING_REVIEW' && (
            <>
              <DropdownItem
                icon={Eye}
                label="عرض الكورس"
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/courses/${course.id}`,
                    '_blank',
                  )
                }
              />
              <DropdownItem
                icon={Pencil}
                label="تعديل البيانات"
                onClick={() => router.push(`/courses/${course.id}`)}
              />
              <DropdownItem
                icon={CheckCircle2}
                label="قبول ونشر"
                hoverClass="hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => handleAction('publish')}
              />
              <DropdownItem
                icon={AlertTriangle}
                label="طلب تعديلات"
                hoverClass="hover:bg-amber-50 hover:text-amber-700"
                onClick={() => handleAction('request_changes')}
              />
            </>
          )}

          {course.status === 'CHANGES_REQUESTED' && (
            <>
              <DropdownItem
                icon={Eye}
                label="عرض الكورس"
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/courses/${course.id}`,
                    '_blank',
                  )
                }
              />
              <DropdownItem
                icon={Pencil}
                label="تعديل البيانات"
                onClick={() => router.push(`/courses/${course.id}`)}
              />
              <DropdownItem
                icon={Upload}
                label="إعادة تقديم"
                hoverClass="hover:bg-blue-50 hover:text-blue-700"
                onClick={() => handleAction('submit_review')}
              />
            </>
          )}

          {course.status === 'PUBLISHED' && (
            <>
              <DropdownItem
                icon={Eye}
                label="عرض الكورس"
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/courses/${course.id}`,
                    '_blank',
                  )
                }
              />
              <DropdownItem
                icon={Pencil}
                label="تعديل البيانات"
                onClick={() => router.push(`/courses/${course.id}`)}
              />
              <DropdownItem
                icon={Archive}
                label="أرشفة الكورس"
                hoverClass="hover:bg-red-50 hover:text-red-700"
                onClick={() => handleAction('archive')}
              />
            </>
          )}

          {course.status === 'ARCHIVED' && (
            <>
              <DropdownItem
                icon={RotateCcw}
                label="استعادة الكورس"
                hoverClass="hover:bg-blue-50 hover:text-blue-700"
                onClick={() => handleAction('restore')}
              />
              <DropdownItem
                icon={Archive}
                label="حذف نهائي"
                hoverClass="hover:bg-red-100 hover:text-red-800 font-bold"
                onClick={() => handleAction('delete')}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
