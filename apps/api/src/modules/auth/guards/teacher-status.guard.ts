import { UserRole } from '@lms/shared-types';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class TeacherStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true; // Let JWT auth handle missing users
    if (user.role !== UserRole.TEACHER) return true; // Only apply to teachers

    if (user.isBanned) {
      if (user.banExpiresAt && new Date(user.banExpiresAt) < new Date()) {
        return true; // Ban has expired
      }
      throw new ForbiddenException('حسابك موقوف. يرجى التواصل مع الإدارة.');
    }

    if (user.isLocked) {
      throw new ForbiddenException('حسابك مقفل مؤقتاً. يرجى التواصل مع الإدارة.');
    }

    return true;
  }
}
