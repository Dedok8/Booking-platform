import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'node:crypto';

export const MediaEntity = defineEntity({
  name: 'Media',
  tableName: 'media',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    modelType: p.string(),
    modelId: p.string(),
    collectionName: p.string().default('default'),
    fileName: p.string(),
    storageKey: p.string(),
    mimeType: p.string(),
    size: p.integer(),
    customProperties: p
      .json<Record<string, unknown>>()
      .defaultRaw("'{}'::jsonb"),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
  indexes: [
    {
      properties: ['modelType', 'modelId'],
    },
  ],
});

export type Media = InferEntity<typeof MediaEntity>;
