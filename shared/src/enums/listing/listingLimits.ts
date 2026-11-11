export const LISTING_LIMITS = {
  DESCRIPTION_MAX: 500,
  DESCRIPTION_MIN: 2,
  CITY_MAX: 100,
  CITY_MIN: 100,
  ADDRESS_MAX: 100,
  ADDRESS_MIN: 2,
  TITLE_MIN: 2,
  TITLE_MAX: 200,
  IMAGES_MAX: 10,
  IMAGE_MAX_BYTES: 5 * 1024 * 1024,
  IMAGE_ALT_MAX: 200,
} as const;

export const LISTING_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
