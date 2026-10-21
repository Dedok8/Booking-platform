import { ThrottlerOptions } from '@nestjs/throttler';

export const throttlerConfig = {
  default: {
    ttl: 6_000_0,
    limit: 300,
  },
  login: {
    ttl: 15 * 6_000_0,
    limit: 5,
  },
  register: {
    ttl: 60 * 6_000_0,
    limit: 5,
  },
  refresh: {
    ttl: 6_000_0,
    limit: 10,
  },
  email: {
    ttl: 6_000_0,
    limit: 10,
  },
} satisfies Record<string, ThrottlerOptions>;
