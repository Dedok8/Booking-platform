import { SessionRepository } from '@/module/auth/domain/interfaces/refresh-session.repository.js';
import { AUTH_MAINTENANCE_QUEUE } from '@/shared/constants/auth.constants.js';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export class SessionCleanupScheduler implements OnModuleInit {
  constructor(
    @InjectQueue(AUTH_MAINTENANCE_QUEUE) private readonly queue: Queue,
  ) {}
  async onModuleInit() {
    await this.queue.upsertJobScheduler(
      'cleanup-expired-session',
      {
        pattern: '0 3 * * *',
      },
      {
        name: 'cleanup',
        opts: { removeOnComplete: true, removeOnFail: 20 },
      },
    );
  }
}

@Processor(AUTH_MAINTENANCE_QUEUE)
export class SessionCleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(SessionCleanupProcessor.name);

  constructor(private readonly session: SessionRepository) {
    super();
  }

  async process(): Promise<void> {
    const remove = await this.session.deleteExpired();
    this.logger.log(`Remove ${remove} expired sessions`);
  }
}
