import { CategoryEntity } from '@/module/category/domain/entity/category.entity.js';
import { UserEntity } from '@/module/user/domain/entities/user.entity.js';
import {
  LISTING_LIMITS,
  LISTING_STATUS,
  PRICING_UNIT,
} from '@booking-platform/shared';
import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'node:crypto';

export const ListingEntity = defineEntity({
  name: 'Listing',
  tableName: 'listing',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    owner: () => p.manyToOne(UserEntity).ref(),
    category: () => p.manyToOne(CategoryEntity).ref(),
    title: p.string().length(LISTING_LIMITS.TITLE_MAX),
    slug: p.string().unique(),
    description: p.text(),
    pricePerUnit: p.integer(),
    currency: p.string().length(3),
    pricingUnit: p.enum(() => PRICING_UNIT),
    capacity: p.integer(),
    city: p.string().length(LISTING_LIMITS.CITY_MAX),
    address: p.string().length(LISTING_LIMITS.ADDRESS_MAX),
    status: p.enum(() => LISTING_STATUS),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
  indexes: [
    { properties: ['status', 'createdAt'] },
    { properties: ['city'] },
    { properties: ['category'] },
    { properties: ['owner'] },
  ],
});

export type Listing = InferEntity<typeof ListingEntity>;
