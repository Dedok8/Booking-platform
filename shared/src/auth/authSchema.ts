import { z } from "zod";
import { EmailSchema } from "../common/auth/emailSchema";
import { CreateUserSchema, UserDtoSchema } from "../user/userSchema";

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z
    .string({ error: "validation.required" })
    .min(1, { error: "validation.required" })
    .max(64, { error: "validation.auth.password.max" }),
});

export const ConfirmEmailSchema = z.object({
  email: EmailSchema,
  code: z
    .string({ error: "validation.required" })
    .regex(/^\d{6}$/, { error: "validation.auth.code.format" }),
});

export const ResendConfirmationSchema = z.object({ email: EmailSchema });

export const RegisterSchema = CreateUserSchema;

export const RegisterFormSchema = RegisterSchema.extend({
  confirmPassword: z
    .string({ error: "validation.required" })
    .min(1, { error: "validation.required" }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  error: "validation.auth.password.mismatch",
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: UserDtoSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RegisterFormInput = z.infer<typeof RegisterFormSchema>;
export type ConfirmEmailInput = z.infer<typeof ConfirmEmailSchema>;
export type ResendConfirmationInput = z.infer<typeof ResendConfirmationSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
