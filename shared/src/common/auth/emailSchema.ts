import { email, z } from "zod";
import { USER_LIMITS } from "../../enums";

export const EmailSchema = z
  .string({ error: "validation.required" })
  .trim()
  .toLowerCase()
  .max(USER_LIMITS.EMAIL_MAX, { error: "validation.email.max" })
  .pipe(email({ error: "validation.auth.email.invalid" }));
