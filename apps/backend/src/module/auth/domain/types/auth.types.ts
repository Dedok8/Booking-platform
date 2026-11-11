import { USER_ROLE } from '@booking-platform/shared';

export interface IAccessTokenPayload {
  sub: string;
  sid: string;
  role: USER_ROLE;
}

export interface IRefreshTokenPayload {
  sub: string;
  sid: string;
  fid: string;
}

export interface IAuthUser {
  id: string;
  role: USER_ROLE;
  sessionId: string;
}

export interface ISessionMeta {
  ip: string | null;
  userAgent: string | null;
}
