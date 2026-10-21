import { Module } from '@nestjs/common';

import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '@/shared/filters/all.exceptions.filter.js';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppConfigModule } from '@/core/core.module.js';
import { AuthModule } from '@/module/auth/auth.module.js';
import { MailModule } from '@/module/mail/mail.module.js';
import { UserModule } from '@/module/user/user.module.js';

@Module({
  imports: [AppConfigModule, AuthModule, MailModule, UserModule],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
