import { z } from "zod";
import { ErrorCode } from "./errorCode";

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.enum(ErrorCode),
  message: z.string(),
  errors: z
    .array(z.object({ path: z.string(), message: z.string() }))
    .optional(),
  requestId: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.string().optional(),
  params: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
