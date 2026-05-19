import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import type { User } from '../../../generated/client';

/** Blocks users who have not completed OTP verification. */
@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user as User | undefined;
    if (!user?.isVerified) {
      throw new ForbiddenException('OTP_VERIFICATION_REQUIRED');
    }
    return true;
  }
}
