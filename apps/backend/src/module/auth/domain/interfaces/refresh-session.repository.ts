import { RefreshSession } from '@/module/auth/domain/entities/refresh-session.entity.js';

export interface ICreateSessionData {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent: string | null;
  ip: string | null;
}

export abstract class SessionRepository {
  abstract findById(id: string): Promise<RefreshSession | null>;
  abstract create(data: ICreateSessionData): RefreshSession;
  abstract revokeIfActive(id: string): Promise<boolean>;
  abstract revokeFamily(familyId: string): Promise<void>;
  abstract revokeAllForUser(
    userId: string,
    exceptSessionId?: string,
  ): Promise<void>;
  abstract deleteExpired(): Promise<number>;
  abstract flush(): Promise<void>;
}
