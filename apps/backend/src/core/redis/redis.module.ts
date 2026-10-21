import { RedisCacheService } from '@/core/redis/redis-cache.service.js';
import { RedisService } from '@/core/redis/redis.service.js';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [RedisService, RedisCacheService],
  exports: [RedisService, RedisCacheService],
})
export class RedisModule {}
