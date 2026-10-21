import { z } from "zod";
import { PasswordSchema } from "../common/auth/passwordSchema";
import { EmailSchema } from "../common/auth/emailSchema";
import { SORT_USER, USER_LIMITS, USER_ROLE } from "../enums";
import { SearchSchema } from "../common/searchSchema";
import { BaseQuerySchema } from "../pagination/paginationSchema";

const NameSchema = z
  .string({ error: "validation.string" })
  .trim()
  .min(USER_LIMITS.NAME_MIN, { error: "validation.user.name.min" })
  .max(USER_LIMITS.NAME_MAX, { error: "validation.user.name.max" });

const BioSchema = z
  .string({ error: "validation.string" })
  .trim()
  .max(USER_LIMITS.BIO_MAX, { error: "validation.user.bio.max" });

export const UserDtoSchema = z.object({
  id: z.uuid(),
  name: NameSchema,
  email: EmailSchema,
  role: z.enum(USER_ROLE),
  bio: BioSchema.nullable(),
  createdAt: z.iso.datetime(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "validation.user.currentPassword.required" })
      .min(1, { error: "validation.user.currentPassword.required" })
      .max(64, { error: "validation.user.currentPassword.max" }),
    newPassword: PasswordSchema,
  })
  .refine((v) => v.currentPassword !== v.newPassword, {
    error: "validation.user.newPassword.sameAsCurrent",
    path: ["newPassword"],
  });

export const CreateUserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  role: z.enum(USER_ROLE, { error: "validation.user.role.invalid" }).optional(),
  emailVerifiedAt: z.iso.datetime(),
});

export const SearchUserSchema = SearchSchema;

export const UpdateUserRoleSchema = z.object({
  role: z.enum(USER_ROLE, { error: "validation.user.role.invalid" }),
});

export const UpdateUserSchema = z.object({
  name: NameSchema,
  bio: BioSchema.nullable().optional(),
});

export const UserQuerySchema = BaseQuerySchema.extend({
  sortBy: z
    .enum(SORT_USER, { error: "validation.user.sortBy.invalid" })
    .default(SORT_USER.CREATED_AT),
  role: z.enum(USER_ROLE, { error: "validation.user.role.invalid" }).optional(),
});

export type UserDtoInput = z.infer<typeof UserDtoSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SearchUserInput = z.infer<typeof SearchUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
