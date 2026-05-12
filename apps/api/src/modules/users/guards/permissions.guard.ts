import { UserRole } from '@lms/shared-types';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // SuperAdmin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Only AssistantAdmins need to check the permissions table.
    // Other roles (like TEACHER) rely on RolesGuard for their access.
    if (user.role !== UserRole.ASSISTANT_ADMIN) {
      return true;
    }

    // Fetch user permissions from DB
    const assistantPermissions = await this.prisma.assistantPermission.findMany({
      where: { assistantUserId: user.id },
      select: { permission: true },
    });

    const userPermissions = assistantPermissions.map((p: { permission: string }) => p.permission);

    // Check if the user has all the required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have the required permissions to perform this action',
      );
    }

    return true;
  }
}
