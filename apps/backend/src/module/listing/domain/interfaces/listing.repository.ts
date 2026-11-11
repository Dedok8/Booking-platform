import { Listing } from '@/module/listing/domain/entities/listing.entity.js';
import { SORT_ORDER } from '@booking-platform/shared';

export interface ICreateListing {
  title: string;
  description: string;
  categoryId: string;
  pricePerUnit: number;
  currency: string;
  pricingUnit: string;
  capacity: number;
  city: string;
  address: string;
}

export interface IUpdateListing extends Partial<ICreateListing> {}

export interface IListingQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy: string;
  categoryId: string;
  city: string;
  status: string;
  pricingUnit: string;
  minPrice: number;
  maxPrice: number;
  guest: number;
  ownerId: number;
  sortOrder: SORT_ORDER;
}

export abstract class ListingRepository {
  abstract findById(id: string): Promise<Listing | null>;
}
