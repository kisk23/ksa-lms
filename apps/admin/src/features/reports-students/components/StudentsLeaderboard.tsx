import { Eye } from 'lucide-react';
import Image from 'next/image';

import type { Student } from '../types';

interface StudentsLeaderboardProps {
  students: Student[];
}

export function StudentsLeaderboard({ students }: StudentsLeaderboardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#0F172A]">الطلاب الأكثر تفاعلاً</h2>
        <button className="text-[#2446b8] hover:text-[#1e40af] text-sm font-medium transition-colors">
          عرض الكل
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[#64748B] text-sm font-medium">
              <th className="px-5 py-4">الطالب</th>
              <th className="px-5 py-4">المقرر الحالي</th>
              <th className="px-5 py-4">التقدم</th>
              <th className="px-5 py-4">آخر نشاط</th>
              <th className="px-5 py-4">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-100 flex items-center justify-center text-sm font-semibold text-[#0F172A]">
                      {student.avatar ? (
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="object-cover w-10 h-10"
                          unoptimized
                        />
                      ) : (
                        student.initials
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-[#0F172A]">{student.name}</div>
                      <div className="text-sm text-[#64748B]">ID: {student.studentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: student.courseBadgeColor }}
                  >
                    {student.course}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2446b8]"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#64748B]">{student.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#64748B]">{student.lastActivity}</td>
                <td className="px-5 py-4 text-center">
                  <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-[#64748B] hover:bg-[#2446b8] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
