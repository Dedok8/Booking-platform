import { Module } from '@nestjs/common';

import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '@/shared/filters/all.exceptions.filter.js';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppConfigModule } from '@/core/core.module.js';
import { AuthModule } from '@/module/auth/auth.module.js';
import { MailModule } from '@/module/mail/mail.module.js';
import { UserModule } from '@/module/user/user.module.js';
import { CategoryModule } from '@/module/category/category.module.js';
import { PostsModule } from '@/module/posts/posts.module.js';
import { S3StorageService } from '@/core/storage/s3-storage.service.js';
import { LocalStorageService } from '@/core/storage/local-storage.service.js';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    MailModule,
    UserModule,
    CategoryModule,
    PostsModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: 'StorageService',
      useClass:
        process.env.NODE_ENV === 'production'
          ? S3StorageService
          : LocalStorageService,
    },
  ],
})
export class AppModule {}
