import { z } from "zod";
import { CATEGORY_LIMITS, SORT_CATEGORY } from "../enums";
import { slugSchema } from "../common";
import {
  BaseQuerySchema,
  dateRangeError,
  DateRangeSchema,
  isValidDateRange,
} from "../pagination";

const CategoryNameSchema = z
  .string({ error: "validation.string" })
  .trim()
  .min(CATEGORY_LIMITS.NAME_MIN, { error: "validation.category.name.min" })
  .max(CATEGORY_LIMITS.NAME_MAX, { error: "validation.category.name.max" });

export const CreateCategorySchema = z.object({
  name: CategoryNameSchema,
  slug: slugSchema,
});

export const UpdateCategorySchema = z.object({
  name: CategoryNameSchema.optional(),
  slug: slugSchema.optional(),
  isActive: z.boolean().optional(),
});

export const CategoryDtoSchema = z.object({
  id: z.uuid(),
  name: CategoryNameSchema,
  slug: slugSchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
});

export const CategoryQuerySchema = BaseQuerySchema.extend({
  // search: z
  //   .string({ error: "validation.string" })
  //   .trim()
  //   .max(CATEGORY_LIMITS.NAME_MAX)
  //   .optional(),
  sortBy: z
    .enum(SORT_CATEGORY, {
      error: "validation.category.sortBy.invalid",
    })
    .default(SORT_CATEGORY.CREATED_AT),
  isActive: z.stringbool({ error: "validation.boolean" }).optional(),
})
  .extend(DateRangeSchema.shape)
  .refine(isValidDateRange, dateRangeError);

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryDto = z.infer<typeof CategoryDtoSchema>;
export type CategoryQueryInput = z.infer<typeof CategoryQuerySchema>;
