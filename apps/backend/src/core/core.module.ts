import { AppBullModule } from '@/core/config/bullmq/bullmq.module.js';
import { validateEnv } from '@/core/config/validation/env.validation.js';
import { DBModule } from '@/core/db/db.module.js';
import { HealthController } from '@/core/health/health.controller.js';
import { RedisModule } from '@/core/redis/redis.module.js';
import { AppThrottlerModule } from '@/core/throttler/throttler.module.js';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      validate: validateEnv,
    }),
    DBModule,
    RedisModule,
    AppThrottlerModule,
    AppBullModule,
  ],
  controllers: [HealthController],
})
export class AppConfigModule {}
