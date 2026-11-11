import z from "zod";

export const ListingStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const PricingUnitSchema = z.enum(["HOUR", "DAY", "SLOT"]);

export const PRICING_UNIT = {
  HOUR: "HOUR",
  DAY: "DAY",
  SLOT: "SLOT",
} as const;

export const LISTING_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type PricingUnit = (typeof PRICING_UNIT)[keyof typeof PRICING_UNIT];
export type ListingStatus =
  (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];


  