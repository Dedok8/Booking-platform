import z from "zod";
import { LISTING_LIMITS } from "../../enums";

export const TitleSchema = z
  .string({ error: "validation.string" })
  .trim()
  .min(LISTING_LIMITS.TITLE_MIN, { error: "validation.listing.title.min" })
  .max(LISTING_LIMITS.TITLE_MAX, { error: "validation.listing.title.max" });

export const DescriptionSchema = z
  .string({ error: "validation.string" })
  .trim()
  .min(LISTING_LIMITS.DESCRIPTION_MIN, {
    error: "validation.listing.description.min",
  })
  .max(LISTING_LIMITS.DESCRIPTION_MAX, {
    error: "validation.listing.description.max",
  });

export const CurrencySchema = z
  .string({ error: "validation.string" })
  .trim()
  .length(3, { error: "validation.listing.currency.invalid" })
  .toUpperCase();

export const PriceSchema = z
  .number({ error: "validation.number" })
  .int({ error: "validation.integer" })
  .positive({ error: "validation.listing.price.positive" });

export const CapacitySchema = z
  .number({ error: "validation.number" })
  .int({ error: "validation.integer" })
  .positive({ error: "validation.listing.capacity.positive" });

export const CitySchema = z
  .string({ error: "validation.string" })
  .trim()
  .min(LISTING_LIMITS.CITY_MIN, { error: "validation.listing.city.min" })
  .max(LISTING_LIMITS.CITY_MAX, { error: "validation.listing.city.max" });

export const AddressSchema = z
  .string({ error: "validation.string" })
  .trim()
  .min(LISTING_LIMITS.ADDRESS_MIN, { error: "validation.listing.address.min" })
  .max(LISTING_LIMITS.ADDRESS_MAX, { error: "validation.listing.address.max" });
