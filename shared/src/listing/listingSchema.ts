import { z } from "zod";

import { SearchSchema } from "../common/searchSchema";
import { slugSchema } from "../common/slugSchema";
import {
  BaseQuerySchema,
  dateRangeError,
  DateRangeSchema,
  isValidDateRange,
} from "../pagination";
import { LISTING_LIMITS, SORT_LISTING } from "../enums/listing";
import {
  ListingStatusSchema,
  PricingUnitSchema,
} from "../enums/listing/listingEnum";
import {
  AddressSchema,
  CapacitySchema,
  CitySchema,
  CurrencySchema,
  DescriptionSchema,
  PriceSchema,
  TitleSchema,
} from "../common";

export const ListingImageSchema = z.object({
  id: z.uuid(),
  url: z.string(),
  thumbnailUrl: z.string().nullable(),
  alt: z.string(),
});

export const UploadListingImageSchema = z.object({
  alt: z
    .string({ error: "validation.string" })
    .trim()
    .max(LISTING_LIMITS.IMAGE_ALT_MAX, {
      error: "validation.listing.images.alt.max",
    })
    .default(""),
});

export const ListingDtoSchema = z.object({
  id: z.uuid(),
  ownerId: z.uuid(),
  categoryId: z.uuid(),
  title: TitleSchema,
  slug: slugSchema,
  description: DescriptionSchema,
  pricePerUnit: PriceSchema,
  currency: CurrencySchema,
  pricingUnit: PricingUnitSchema,
  capacity: CapacitySchema,
  city: CitySchema,
  address: AddressSchema,
  status: ListingStatusSchema.default("DRAFT"),
  images: z
    .array(ListingImageSchema, { error: "validation.listing.images.invalid" })
    .max(LISTING_LIMITS.IMAGES_MAX, { error: "validation.listing.images.max" }),
  createdAt: z.iso.datetime(),
});

export const CreateListingSchema = z.object({
  title: TitleSchema,
  description: DescriptionSchema,
  categoryId: z.uuid({ error: "validation.uuid" }),
  pricePerUnit: PriceSchema,
  currency: CurrencySchema.default("EUR"),
  pricingUnit: PricingUnitSchema,
  capacity: CapacitySchema,
  city: CitySchema,
  address: AddressSchema,
});

export const UpdateListingSchema = z.object({
  title: TitleSchema.optional(),
  description: DescriptionSchema.optional(),
  categoryId: z.uuid({ error: "validation.uuid" }).optional(),
  pricePerUnit: PriceSchema.optional(),
  currency: CurrencySchema.optional(),
  pricingUnit: PricingUnitSchema.optional(),
  capacity: CapacitySchema.optional(),
  city: CitySchema.optional(),
  address: AddressSchema.optional(),
});

export const SearchListingSchema = SearchSchema;

export const ListingQuerySchema = BaseQuerySchema.extend({
  sortBy: z
    .enum(SORT_LISTING, { error: "validation.listing.sortBy.invalid" })
    .default(SORT_LISTING.CREATED_AT),
  categoryId: z.uuid({ error: "validation.uuid" }).optional(),
  city: z.string({ error: "validation.string" }).trim().min(1).optional(),
  status: ListingStatusSchema.optional(),
  pricingUnit: PricingUnitSchema.optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  guests: z.coerce.number().int().min(1).optional(),
  ownerId: z.uuid({ error: "validation.uuid" }).optional(),
})
  .extend(DateRangeSchema.shape)
  .refine(isValidDateRange, dateRangeError)
  .refine(
    (q) =>
      q.minPrice === undefined ||
      q.maxPrice === undefined ||
      q.minPrice <= q.maxPrice,
    { error: "validation.listing.price.order", path: ["minPrice"] }
  );

export type ListingDtoInput = z.infer<typeof ListingDtoSchema>;
export type CreateListingInput = z.infer<typeof CreateListingSchema>;
export type UpdateListingInput = z.infer<typeof UpdateListingSchema>;
export type SearchListingInput = z.infer<typeof SearchListingSchema>;
export type ListingQueryInput = z.infer<typeof ListingQuerySchema>;
export type UploadListingImageInput = z.infer<typeof UploadListingImageSchema>;
export type ListingImageInput = z.infer<typeof ListingImageSchema>;
