'use client';

import { Card } from '@shared/components/ui/Card';
import { apiClient } from '@shared/lib/api-client';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegistrationStats {
  newStudents: number;
  newTeachers: number;
  newParents: number;
  totalThisWeek: number;
  activeEnrollmentsThisWeek: number;
  breakdown: {
    students: number;
    teachers: number;
    parents: number;
  };
}

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────

interface DonutSegment {
  pct: number;
  color: string;
  label: string;
}

function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const r = 56;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * r;
  const cx = 80;
  const cy = 80;

  // Build cumulative offsets so each segment starts after the previous
  let cumulativePct = 0;
  const rendered: Array<{ segment: DonutSegment; dashOffset: number; dashArray: string }> = [];

  for (const seg of segments) {
    const pct = seg.pct > 0 ? seg.pct : 0;
    const dash = (pct / 100) * circumference;
    // offset = circumference - (how far around we start)
    const offset = circumference - (cumulativePct / 100) * circumference;
    rendered.push({
      segment: seg,
      dashOffset: offset,
      dashArray: `${dash} ${circumference - dash}`,
    });
    cumulativePct += pct;
  }

  // If all zeros show an empty grey ring
  const isEmpty = total === 0;

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-surface-container-highest opacity-40"
        />

        {isEmpty ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-surface-container-highest"
          />
        ) : (
          rendered.map(({ segment, dashOffset, dashArray }) => (
            <circle
              key={segment.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              strokeWidth={strokeWidth}
              stroke={segment.color}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
            />
          ))
        )}
      </svg>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-h2-ar font-h2-ar text-on-surface leading-tight">
          {total.toLocaleString('ar-EG')}
        </span>
        <span className="text-caption-ar font-caption-ar text-outline mt-0.5">هذا الأسبوع</span>
      </div>
    </div>
  );
}

// ─── Colour constants (match Tailwind CSS vars) ───────────────────────────────

const COLORS = {
  students: 'var(--color-primary)',
  teachers: 'var(--color-tertiary)',
  parents: 'var(--color-secondary)',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function EnrollmentsChart() {
  const [data, setData] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const result = await apiClient.get<RegistrationStats>('/enrollments/stats');
        setData(result);
      } catch (err) {
        console.error('Failed to fetch enrollment stats', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // ── Segments derived from real data ──────────────────────────────────────
  const segments: DonutSegment[] = data
    ? [
        { pct: data.breakdown.students, color: COLORS.students, label: 'students' },
        { pct: data.breakdown.teachers, color: COLORS.teachers, label: 'teachers' },
        { pct: data.breakdown.parents, color: COLORS.parents, label: 'parents' },
      ]
    : [];

  const legend = data
    ? [
        {
          colorVar: COLORS.students,
          cssClass: 'bg-primary',
          label: 'طلاب جدد',
          count: data.newStudents,
          pct: `${data.breakdown.students}%`,
        },
        {
          colorVar: COLORS.teachers,
          cssClass: 'bg-tertiary',
          label: 'معلمين',
          count: data.newTeachers,
          pct: `${data.breakdown.teachers}%`,
        },
        {
          colorVar: COLORS.parents,
          cssClass: 'bg-secondary',
          label: 'أولياء أمور',
          count: data.newParents,
          pct: `${data.breakdown.parents}%`,
        },
      ]
    : [];

  return (
    <Card>
      <h3 className="text-h2-ar font-h2-ar text-on-surface mb-md">التسجيلات الأخيرة</h3>

      {/* ── Loading ── */}
      {loading && (
        <div className="h-[260px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="h-[260px] flex items-center justify-center text-error text-caption-ar font-caption-ar text-center px-4">
          {error}
        </div>
      )}

      {/* ── Data ── */}
      {!loading && !error && data && (
        <>
          {/* Donut */}
          <div className="flex items-center justify-center mb-md">
            <DonutChart segments={segments} total={data.totalThisWeek} />
          </div>

          {/* Legend rows */}
          <div className="space-y-sm">
            {legend.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-caption-ar font-caption-ar"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.colorVar }}
                  />
                  <span className="text-on-surface">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span>{item.count.toLocaleString('ar-EG')}</span>
                  <span className="font-bold text-on-surface">{item.pct}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active enrollments sub-stat */}
          {data.activeEnrollmentsThisWeek > 0 && (
            <div className="mt-md pt-sm border-t border-outline-variant/20 flex items-center justify-between text-caption-ar font-caption-ar text-outline">
              <span>تسجيلات مفعّلة هذا الأسبوع</span>
              <span className="font-bold text-on-surface">
                {data.activeEnrollmentsThisWeek.toLocaleString('ar-EG')}
              </span>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
