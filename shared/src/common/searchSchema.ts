import { z } from "zod";

export const SearchSchema = z.object({
  query: z
    .string({ error: "validation.string" })
    .trim()
    .max(100, { error: "validation.search.query.max" })
    .optional()
    .transform((v) => v || undefined),
});
