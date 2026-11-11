import { CATEGORY_LIMITS } from '@booking-platform/shared';
import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'node:crypto';

export const CategoryEntity = defineEntity({
  name: 'Category',
  tableName: 'category',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string().length(CATEGORY_LIMITS.NAME_MAX),
    slug: p.string().unique(),
    isActive: p.boolean().default(true),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type Category = InferEntity<typeof CategoryEntity>;
