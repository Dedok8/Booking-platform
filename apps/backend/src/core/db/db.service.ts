import { MikroORM } from '@mikro-orm/core';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DBService implements OnModuleInit {
  private readonly logger = new Logger(DBService.name);

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    try {
      await this.orm.connect();
    } catch (e) {
      this.logger.error(
        'connect() failed',
        e instanceof Error ? e.stack : String(e),
      );
      throw e;
    }

    const result = await this.orm.checkConnection();
    if (!result.ok) {
      this.logger.error(`DB connection failed: ${result.reason}`);
      throw result.error ?? new Error(result.reason);
    }

    this.logger.log('DB connected successfully');
  }

  async isHealthy(): Promise<boolean> {
    const result = await this.orm.checkConnection();
    return result.ok;
  }
}
