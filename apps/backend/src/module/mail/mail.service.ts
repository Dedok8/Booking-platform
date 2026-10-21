import {
  MAIL_QUEUE,
  VerificationCodeJob,
} from '@/shared/constants/mail.constants.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly queue: Queue<VerificationCodeJob>,
  ) {}

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.queue.add(
      'verification-code',
      { to, code },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }
}
