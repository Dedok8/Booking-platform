import { AuthUser } from '@/module/auth/domain/types/auth.types.js';
import { Request } from 'express';

export const AUTH_MAINTENANCE_QUEUE = 'auth-maintenance';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
