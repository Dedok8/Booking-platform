export const SORT_CATEGORY = {
  NAME: "name",
  SLUG: "Slug",
  ISACTIVE: "isActive",
  CREATED_AT: "createdAt",
} as const;

export type SORT_CATEGORY = (typeof SORT_CATEGORY)[keyof typeof SORT_CATEGORY];
