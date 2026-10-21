import { Env } from '@/core/config/validation/env.validation.js';
import {
  MAIL_QUEUE,
  VerificationCodeJob,
} from '@/shared/constants/mail.constants.js';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import nodemailer, { Transporter } from 'nodemailer';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(config: ConfigService<Env, true>) {
    super();
    this.from = config.get('MAIL_FROM', { infer: true });
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST', { infer: true }),
      port: config.get('MAIL_PORT', { infer: true }),
      secure: config.get('MAIL_SECURE', { infer: true }),
      auth: {
        user: config.get('MAIL_USER', { infer: true }),
        pass: config.get('MAIL_PASSWORD', { infer: true }),
      },
    });
  }

  async process(job: Job<VerificationCodeJob>) {
    await this.transporter.sendMail({
      from: this.from,
      to: job.data.to,
      subject: 'Confirm your email',
      text: `Your confirmation code: ${job.data.code}\nIt expires in 15 minutes.`,
    });
  }
}
