import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);
  readonly defaultTTL: number;

  constructor(private readonly configService: ConfigService) {
    super({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD') || undefined,
      db: configService.get<number>('REDIS_DB', 0),
      retryStrategy: (times: number) => {
        if (times > 5) {
          return null;
        }
        return Math.min(times * 300, 3000);
      },
      reconnectOnError: (err: Error) => {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
        return targetErrors.some((e) => err.message.includes(e));
      },
      lazyConnect: true,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    });

    this.on('error', (err: Error) => {
      this.logger.error(`Redis error: ${err.message}`);
    });

    this.defaultTTL = configService.get<number>('REDIS_TTL', 300);
  }
  async onModuleDestroy() {
    await this.quit();
    this.logger.log('Redis disconnected');
  }

  async onModuleInit() {
    try {
      await this.connect();
      this.logger.log('Redis connected');
    } catch (err) {
      this.logger.error('Redis connection failed', err);
      throw err;
    }
  }
}
