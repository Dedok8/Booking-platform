import { StorageService } from '@/core/storage/storage.service.js';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class LocalStorageService extends StorageService {
  private readonly root = path.resolve(process.env.UPLOADS_DIR ?? './uploads');

  async put(key: string, buffer: Buffer): Promise<void> {
    await mkdir(this.root, { recursive: true });
    await writeFile(this.resolve(key), buffer);
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolve(key), { force: true });
  }

  url(key: string): string {
    return `${process.env.APP_URL ?? ''}/uploads/${key}`;
  }


  private resolve(key: string): string {
    const full = path.resolve(this.root, key);
    if (!full.startsWith(this.root + path.sep)) {
      throw new Error('Invalid storage key');
    }
    return full;
  }
}
