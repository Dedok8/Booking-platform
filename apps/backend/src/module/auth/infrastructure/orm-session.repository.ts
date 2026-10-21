import {
  RefreshSession,
  RefreshSessionEntity,
} from '@/module/auth/domain/entities/refresh-session.entity.js';
import {
  ICreateSessionData,
  SessionRepository,
} from '@/module/auth/domain/interfaces/refresh-session.repository.js';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmSessionRepository implements SessionRepository {
  constructor(private readonly em: EntityManager) {}

  findById(id: string): Promise<RefreshSession | null> {
    return this.em.findOne(RefreshSessionEntity, { id });
  }

  create(data: ICreateSessionData): RefreshSession {
    const session = this.em.create(RefreshSessionEntity, {
      id: data.id,
      user: data.userId,
      familyId: data.familyId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      userAgent: data.userAgent,
      ip: data.ip,
    });

    this.em.persist(session);

    return session;
  }

  async revokeIfActive(id: string): Promise<boolean> {
    const affected = await this.em.nativeUpdate(
      RefreshSessionEntity,
      {
        id,
        revokeAt: null,
      },
      {
        revokeAt: new Date(),
      },
    );

    return affected > 0;
  }

  async revokeFamily(familyId: string): Promise<void> {
    await this.em.nativeUpdate(
      RefreshSessionEntity,
      {
        familyId,
        revokeAt: null,
      },
      {
        revokeAt: new Date(),
      },
    );
  }

  async revokeAllForUser(
    userId: string,
    exceptSessionId?: string,
  ): Promise<void> {
    await this.em.nativeUpdate(
      RefreshSessionEntity,
      {
        user: userId,
        revokeAt: null,
        ...(exceptSessionId ? { id: { $ne: exceptSessionId } } : {}),
      },
      {
        revokeAt: new Date(),
      },
    );
  }

  async deleteExpired(): Promise<number> {
    return this.em
      .fork()
      .nativeDelete(RefreshSessionEntity, { expiresAt: { $lt: new Date() } });
  }

  async flush(): Promise<void> {
    await this.em.flush();
  }
}
