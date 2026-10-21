import { AuthenticatedRequest } from '@/shared/constants/auth.constants.js';
import { ROLES_KEY } from '@/shared/decorators/roles.decorator.js';
import { AppError } from '@/shared/lib/error.js';
import { USER_ROLE } from '@booking-platform/shared';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<USER_ROLE[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles?.length) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!user || !roles.includes(user.role)) {
      throw AppError.forbidden();
    }
    return true;
  }
}
