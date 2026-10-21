import { Env } from '@/core/config/validation/env.validation.js';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '@/module/auth/domain/types/auth.types.js';
import { parseDurationToSeconds } from '@/shared/lib/duration.js';

import { AppError } from '@/shared/lib/error.js';
import { USER_ROLE } from '@booking-platform/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, timingSafeEqual } from 'node:crypto';
import { uuid, z, ZodType } from 'zod';

const ALGORITHM = 'HS256';

const accessSecretSchema = z.object({
  sub: z.uuid(),
  sid: z.uuid(),
  role: z.enum(USER_ROLE),
});

const refreshSecretSchema = z.object({
  sub: z.uuid(),
  sid: uuid(),
  fid: uuid(),
});

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: number;
  readonly refreshTtlSecond: number;

  constructor(
    private readonly jwt: JwtService,
    config: ConfigService<Env, true>,
  ) {
    this.accessSecret = config.get('JWT_ACCESS_SECRET', { infer: true });
    this.refreshSecret = config.get('JWT_REFRESH_SECRET', { infer: true });
    this.accessTtl = parseDurationToSeconds(
      config.get('JWT_ACCESS_EXPIRES_IN', { infer: true }),
    );
    this.refreshTtlSecond = parseDurationToSeconds(
      config.get('JWT_REFRESH_EXPIRES_IN', { infer: true }),
    );
  }

  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.accessSecret,
      algorithm: ALGORITHM,
      expiresIn: this.accessTtl,
    });
  }

  signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      algorithm: ALGORITHM,
      expiresIn: this.refreshTtlSecond,
    });
  }

  async verifyAccess(token: string): Promise<AccessTokenPayload> {
    return this.verify(token, this.accessSecret, accessSecretSchema);
  }

  async verifyRefresh(token: string): Promise<RefreshTokenPayload> {
    return this.verify(token, this.refreshSecret, refreshSecretSchema);
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  matches(token: string, expectedHash: string): boolean {
    const actual = Buffer.from(this.hash(token));
    const expected = Buffer.from(expectedHash);
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  }

  private async verify<T>(
    token: string,
    secret: string,
    schema: z.ZodType<T>,
  ): Promise<T> {
    try {
      const raw: unknown = await this.jwt.verifyAsync(token, {
        secret,
        algorithms: [ALGORITHM],
      });

      const parsed = schema.safeParse(raw);
      if (!parsed.success) throw new Error('Malformed token payload');

      return parsed.data;
    } catch {
      throw AppError.unauthorized();
    }
  }
}
