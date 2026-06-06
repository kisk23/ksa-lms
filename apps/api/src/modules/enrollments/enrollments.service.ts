import { Injectable } from '@nestjs/common';

import { EnrollmentStatus, UserRole } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface RegistrationStats {
  /** New students registered this week */
  newStudents: number;
  /** New teachers registered this week */
  newTeachers: number;
  /** New parents registered this week */
  newParents: number;
  /** Total new users registered this week (students + teachers + parents) */
  totalThisWeek: number;
  /** Active enrollments created this week */
  activeEnrollmentsThisWeek: number;
  /** Percentage breakdown per role (0-100, rounded) */
  breakdown: {
    students: number;
    teachers: number;
    parents: number;
  };
}

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRegistrationStats(): Promise<RegistrationStats> {
    const now = new Date();

    // Start of the current ISO week: Monday 00:00:00 UTC
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday …
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const [newStudents, newTeachers, newParents, activeEnrollmentsThisWeek] = await Promise.all([
      this.prisma.user.count({
        where: { role: UserRole.STUDENT, createdAt: { gte: startOfWeek } },
      }),
      this.prisma.user.count({
        where: { role: UserRole.TEACHER, createdAt: { gte: startOfWeek } },
      }),
      this.prisma.user.count({
        where: { role: UserRole.PARENT, createdAt: { gte: startOfWeek } },
      }),
      this.prisma.enrollment.count({
        where: { status: EnrollmentStatus.ACTIVE, enrolledAt: { gte: startOfWeek } },
      }),
    ]);

    const totalThisWeek = newStudents + newTeachers + newParents;

    const breakdown = {
      students: totalThisWeek > 0 ? Math.round((newStudents / totalThisWeek) * 100) : 0,
      teachers: totalThisWeek > 0 ? Math.round((newTeachers / totalThisWeek) * 100) : 0,
      parents: totalThisWeek > 0 ? Math.round((newParents / totalThisWeek) * 100) : 0,
    };

    return {
      newStudents,
      newTeachers,
      newParents,
      totalThisWeek,
      activeEnrollmentsThisWeek,
      breakdown,
    };
  }
}
