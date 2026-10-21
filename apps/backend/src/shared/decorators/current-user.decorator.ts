import { AuthUser } from '@/module/auth/domain/types/auth.types.js';
import { AuthenticatedRequest } from '@/shared/constants/auth.constants.js';
import { AppError } from '@/shared/lib/error.js';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) throw AppError.unauthorized;
    return request.user;
  },
);
