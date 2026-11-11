import { z } from "zod";

export const SLUG_MAX = 50;
export const slugSchema = z
  .string({ error: "validation.string" })
  .min(1, { error: "validation.slug.min" })
  .max(SLUG_MAX, { error: "validation.slug.max" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "validation.slug.format" });
