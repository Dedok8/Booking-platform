import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { USER_LIMITS, USER_ROLE } from '@booking-platform/shared';
import { randomUUID } from 'crypto';

export const UserEntity = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string().length(USER_LIMITS.NAME_MAX),
    email: p.string().unique().length(USER_LIMITS.EMAIL_MAX),
    passwordHash: p.string().hidden(),
    refreshToken: p.string().nullable(),
    role: p.enum(() => USER_ROLE).default(USER_ROLE.USER),
    bio: p.string().length(USER_LIMITS.BIO_MAX).nullable(),
    emailVerifiedAt: p.datetime().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type User = InferEntity<typeof UserEntity>;
