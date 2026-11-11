import { StorageService } from '@/core/storage/storage.service.js';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

export class S3StorageService extends StorageService {
  private readonly bucket: string;
  private readonly client: S3Client;

  constructor() {
    super();
    if (!process.env.S3_BUCKET) {
      throw new Error('S3_BUCKET is not set');
    }
    this.bucket = process.env.S3_BUCKET;
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: !!process.env.S3_ENDPOINT,
    });
  }

  async put(key: string, buffer: Buffer, mimeType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  url(key: string): string {
    const base =
      process.env.S3_PUBLIC_URL ??
      `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    return `${base.replace(/\/$/, '')}/${key}`;
  }
}
