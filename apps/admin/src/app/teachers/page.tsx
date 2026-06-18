'use client';

import { apiClient } from '@shared/lib/api-client';
import { ShieldAlert, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isLocked: boolean;
  lockReason: string | null;
  isBanned: boolean;
  banReason: string | null;
  banExpiresAt: string | null;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: User[] }>('/admin/users?role=TEACHER&limit=50');
      setTeachers(res.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleLock = async (id: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        await apiClient.patch(`/admin/teachers/${id}/unlock`, {});
      } else {
        const reason = prompt('سبب الإيقاف المؤقت (اختياري):');
        if (reason === null) return;
        await apiClient.patch(`/admin/teachers/${id}/lock`, { reason });
      }
      fetchTeachers();
    } catch {
      alert('حدث خطأ أثناء تنفيذ الإجراء');
    }
  };

  const handleBan = async (id: string, isBanned: boolean) => {
    try {
      if (isBanned) {
        await apiClient.patch(`/admin/teachers/${id}/unban`, {});
      } else {
        const reason = prompt('سبب الحظر (اختياري):');
        if (reason === null) return;
        await apiClient.patch(`/admin/teachers/${id}/ban`, { reason });
      }
      fetchTeachers();
    } catch {
      alert('حدث خطأ أثناء تنفيذ الإجراء');
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="p-gutter pb-0">
        <div className="mb-8">
          <h1 className="font-h1-ar text-h1-ar text-on-background mb-2">إدارة المعلمين</h1>
          <p className="font-body-ar text-body-ar text-on-surface-variant">
            إدارة حالة حسابات المعلمين وإمكانياتهم
          </p>
        </div>
      </div>

      <div className="flex-grow p-gutter overflow-auto">
        {loading ? (
          <div className="text-center text-on-surface-variant py-12">جاري التحميل...</div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant">
                  <th className="p-4 font-label-ar text-label-ar text-on-surface-variant">
                    المعلم
                  </th>
                  <th className="p-4 font-label-ar text-label-ar text-on-surface-variant">
                    البريد الإلكتروني
                  </th>
                  <th className="p-4 font-label-ar text-label-ar text-on-surface-variant">
                    الحالة
                  </th>
                  <th className="p-4 font-label-ar text-label-ar text-on-surface-variant text-center">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-surface-container-lowest/50 transition-colors"
                  >
                    <td className="p-4 font-body-ar text-body-ar text-on-surface">
                      {teacher.name}
                    </td>
                    <td className="p-4 font-body-en text-body-en text-on-surface-variant">
                      {teacher.email}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {teacher.isBanned && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-container text-error">
                            محظور
                          </span>
                        )}
                        {teacher.isLocked && !teacher.isBanned && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-container text-warning">
                            مقفل
                          </span>
                        )}
                        {!teacher.isBanned && !teacher.isLocked && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-container text-success">
                            نشط
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleLock(teacher.id, teacher.isLocked)}
                        className={`p-2 rounded-lg transition-colors ${
                          teacher.isLocked
                            ? 'bg-warning-container text-warning hover:bg-warning/20'
                            : 'hover:bg-surface-container text-on-surface-variant'
                        }`}
                        title={teacher.isLocked ? 'إلغاء القفل' : 'قفل الحساب (يمنع التعديل)'}
                      >
                        {teacher.isLocked ? <Unlock size={18} /> : <Lock size={18} />}
                      </button>
                      <button
                        onClick={() => handleBan(teacher.id, teacher.isBanned)}
                        className={`p-2 rounded-lg transition-colors ${
                          teacher.isBanned
                            ? 'bg-error-container text-error hover:bg-error/20'
                            : 'hover:bg-surface-container text-on-surface-variant'
                        }`}
                        title={teacher.isBanned ? 'إلغاء الحظر' : 'حظر الحساب (يمنع الدخول)'}
                      >
                        {teacher.isBanned ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                      لا يوجد معلمين.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
