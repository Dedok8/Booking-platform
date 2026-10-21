import { TokenService } from '@/module/auth/application/token.service.js';
import { AuthenticatedRequest } from '@/shared/constants/auth.constants.js';
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator.js';
import { AppError } from '@/shared/lib/error.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const extractBearer = (header: string | undefined): string | null => {
  const [scheme, token] = header?.split(' ') ?? [];
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractBearer(request.headers.authorization);
    if (!token) throw AppError.unauthorized();

    const payload = await this.tokens.verifyAccess(token);
    request.user = {
      id: payload.sub,
      role: payload.role,
      sessionId: payload.sid,
    };
    return true;
  }
}
