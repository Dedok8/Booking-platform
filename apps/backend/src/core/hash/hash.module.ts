import { HashService } from '@/core/hash/hash.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
