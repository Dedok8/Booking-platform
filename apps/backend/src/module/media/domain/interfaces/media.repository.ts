import { Media } from '@/module/media/domain/entity/media.entity.js';

export interface IAttachInput {
  modelType: string;
  modelId: string;
  collection?: string;
  buffer: Buffer;
  fileName: string;
  customProperties?: Record<string, unknown>;
}

export interface ICreateMediaData {
  modelType: string;
  modelId: string;
  collectionName: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  customProperties: Record<string, unknown>;
}

export abstract class MediaRepository {
  abstract create(data: ICreateMediaData): Promise<Media>;
  abstract findById(id: string): Promise<Media | null>;
  abstract findByEntity(
    modelType: string,
    modelId: string,
    collectionName?: string,
  ): Promise<Media[]>;
  abstract remove(...medias: Media[]): Promise<void>;
}
