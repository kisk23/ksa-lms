import type { User } from '../../../generated/client';

export type SafeUser = Omit<User, 'passwordHash'>;

export function sanitizeUser(user: User): SafeUser {
  const { passwordHash: _, ...safe } = user;
  return safe;
}
