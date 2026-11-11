import { StorageService } from '@/core/storage/storage.service.js';
import {
  NormalizedImage,
  ThumbnailService,
} from '@/module/media/application/thumbnail.service.js';
import { Media } from '@/module/media/domain/entity/media.entity.js';
import {
  IAttachInput,
  MediaRepository,
} from '@/module/media/domain/interfaces/media.repository.js';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface MediaResponse {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  collection: string;
  url: string;
  thumbnailUrl: string | null;
  customProperties: Record<string, unknown>;
}

@Injectable()
export class MediaService {
  constructor(
    private readonly storage: StorageService,
    private readonly medias: MediaRepository,
    private readonly thumbnail: ThumbnailService,
  ) {}

  async attach(input: IAttachInput): Promise<Media> {
    // Валидация и обработка ДО записи в хранилище
    let image: NormalizedImage;
    let thumb: Buffer;
    try {
      image = await this.thumbnail.normalize(input.buffer);
      thumb = await this.thumbnail.thumbnail(image.buffer);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Invalid image file');
    }

    const id = randomUUID();
    const key = `${id}${image.ext}`;
    const thumbKey = `${id}-thumbnail.webp`;
    const uploaded: string[] = [];

    try {
      await this.storage.put(key, image.buffer, image.mime);
      uploaded.push(key);

      await this.storage.put(thumbKey, thumb, 'image/webp');
      uploaded.push(thumbKey);

      return await this.medias.create({
        modelType: input.modelType,
        modelId: input.modelId,
        collectionName: input.collection ?? 'default',
        fileName: input.fileName,
        storageKey: key,
        mimeType: image.mime,
        size: image.buffer.length,
        customProperties: {
          ...input.customProperties,
          thumbnailKey: thumbKey,
        },
      });
    } catch (e) {
      await Promise.allSettled(uploaded.map((k) => this.storage.delete(k)));
      throw e;
    }
  }

  getMediaForEntity(
    modelType: string,
    modelId: string,
    collection?: string,
  ): Promise<Media[]> {
    return this.medias.findByEntity(modelType, modelId, collection);
  }

  async remove(id: string): Promise<void> {
    const media = await this.medias.findById(id);
    if (!media) return;
    await this.deleteFilesAndRows([media]);
  }

  async removeForEntity(modelType: string, modelId: string): Promise<void> {
    const items = await this.medias.findByEntity(modelType, modelId);
    await this.deleteFilesAndRows(items);
  }

  toResponse(media: Media): MediaResponse {
    const thumbKey = this.thumbnailKey(media);
    return {
      id: media.id,
      fileName: media.fileName,
      mimeType: media.mimeType,
      size: media.size,
      collection: media.collectionName,
      url: this.storage.url(media.storageKey),
      thumbnailUrl: thumbKey ? this.storage.url(thumbKey) : null,
      customProperties: media.customProperties,
    };
  }

  private thumbnailKey(media: Media): string | null {
    const key = media.customProperties?.thumbnailKey;
    return typeof key === 'string' ? key : null;
  }

  private async deleteFilesAndRows(items: Media[]): Promise<void> {
    // Сначала БД, потом файлы: если файл не удалится, это лишь мусор,
    // а не битая ссылка в БД
    await this.medias.remove(...items);

    const keys = items.flatMap((m) => {
      const thumb = this.thumbnailKey(m);
      return thumb ? [m.storageKey, thumb] : [m.storageKey];
    });
    await Promise.allSettled(keys.map((k) => this.storage.delete(k)));
  }
}
