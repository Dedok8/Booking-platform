import { UserEntity } from '@/module/user/domain/entities/user.entity.js';
import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'node:crypto';

export const RefreshSessionEntity = defineEntity({
  name: 'RefreshSession',
  tableName: 'refresh_session',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    user: () => p.manyToOne(UserEntity).deleteRule('cascade').index(),
    familyId: p.uuid().index(),
    tokenHash: p.string().length(64),
    expiresAt: p.datetime().index(),
    revokeAt: p.datetime().nullable(),
    userAgent: p.string().length(45).nullable(),
    ip: p.string().length(45).nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type RefreshSession = InferEntity<typeof RefreshSessionEntity>;
