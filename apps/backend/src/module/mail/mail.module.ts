import { MailProcessor } from '@/module/mail/mail.processor.js';
import { MailService } from '@/module/mail/mail.service.js';
import { MAIL_QUEUE } from '@/shared/constants/mail.constants.js';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [BullModule.registerQueue({ name: MAIL_QUEUE })],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
