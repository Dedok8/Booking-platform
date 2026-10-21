import { USER_ROLE } from '@booking-platform/shared';

export interface AccessTokenPayload {
  sub: string;
  sid: string;
  role: USER_ROLE;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
  fid: string;
}

export interface AuthUser {
  id: string;
  role: USER_ROLE;
  sessionId: string;
}

export interface SessionMeta {
  ip: string | null;
  userAgent: string | null;
}
