import { RedisCacheService } from '@/core/redis/redis-cache.service.js';
import { RedisService } from '@/core/redis/redis.service.js';
import { AppError } from '@/shared/lib/error.js';
import { Injectable } from '@nestjs/common';
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

export const CODE_TTL_SECONDS = 15 * 60;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;

const keys = {
  code: (userId: string) => `auth:email-code:${userId}`,
  attempts: (userId: string) => `auth:email-code-attempts:${userId}`,
  resend: (userId: string) => `auth:email-resend:${userId}`,
};

@Injectable()
export class EmailVerificationService {
  constructor(private readonly redis: RedisService) {}

  async issue(userId: string): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.redis
      .multi()
      .set(keys.code(userId), this.digest(userId, code), 'EX', CODE_TTL_SECONDS)
      .del(keys.attempts(userId))
      .exec();
    return code;
  }

  async acquireResendSlot(userId: string): Promise<boolean> {
    const result = await this.redis.set(
      keys.resend(userId),
      1,
      'EX',
      RESEND_COOLDOWN_SECONDS,
      'NX',
    );

    return result === 'OK';
  }

  async verify(userId: string, code: string): Promise<void> {
    const stored = await this.redis.get(keys.code(userId));
    if (!stored) throw AppError.codeExpired();

    const attempts = await this.redis.incr(keys.attempts(userId));

    if (attempts === 1) {
      await this.redis.expire(keys.attempts(userId), CODE_TTL_SECONDS);
    }
    if (attempts > MAX_CODE_ATTEMPTS) {
      await this.redis.del(keys.code(userId));
      throw AppError.tooManyAttempts();
    }

    const given = Buffer.from(this.digest(userId, code));
    const expected = Buffer.from(stored);
    const same =
      given.length === expected.length && timingSafeEqual(given, expected);

    if (!same) throw AppError.invalidCode();

    await this.redis.del(keys.code(userId), keys.attempts(userId));
  }

  private digest(userId: string, code: string): string {
    return createHash('sha256').update(`${userId}:${code}`).digest('hex');
  }
}
