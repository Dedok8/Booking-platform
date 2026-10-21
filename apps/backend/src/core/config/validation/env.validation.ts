import { z } from 'zod';

const bool = z
  .enum(['true', 'false'])
  .default('false')
  .transform((v) => v === 'true');

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().default(3000),
  APP_URL: z.url(),
  FRONTEND_URL: z.url(),
  ENABLE_SWAGGER: bool,

  DATABASE_URL: z.string().startsWith('postgresql'),

  REDIS_HOST: z.string().min(1).default('localhost'),
  REDIS_PORT: z.coerce.number().int().default(6379),
  REDIS_PASSWORD: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  REDIS_DB: z.coerce.number().int().default(0),
  REDIS_TTL: z.coerce.number().int().default(300),

  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/)
    .default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/)
    .default('7d'),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number().int(),
  MAIL_SECURE: bool,
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_FROM: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const result = EnvSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
};
