import { LocalStorageService } from '@/core/storage/local-storage.service.js';
import { S3StorageService } from '@/core/storage/s3-storage.service.js';
import { StorageService } from '@/core/storage/storage.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: StorageService,
      useFactory: (): StorageService =>
        process.env.STORAGE_DRIVER === 's3'
          ? new S3StorageService()
          : new LocalStorageService(),
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
