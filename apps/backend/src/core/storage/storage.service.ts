export abstract class StorageService {
  abstract put(key: string, buffer: Buffer, mimeType: string): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract url(key: string): string;
}
