import {
  Media,
  MediaEntity,
} from '@/module/media/domain/entity/media.entity.js';
import {
  ICreateMediaData,
  MediaRepository,
} from '@/module/media/domain/interfaces/media.repository.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmMediaRepository extends MediaRepository {
  constructor(private readonly em: EntityManager) {
    super();
  }

  async create(data: ICreateMediaData): Promise<Media> {
    const media = this.em.create(MediaEntity, data);
    await this.em.persist(media).flush();
    return media;
  }

  findById(id: string): Promise<Media | null> {
    return this.em.findOne(MediaEntity, { id });
  }

  findByEntity(
    modelType: string,
    modelId: string,
    collectionName?: string,
  ): Promise<Media[]> {
    return this.em.find(
      MediaEntity,
      {
        modelType,
        modelId,
        ...(collectionName ? { collectionName } : {}),
      },
      { orderBy: { createdAt: 'ASC' } },
    );
  }

  async remove(...medias: Media[]): Promise<void> {
    if (medias.length === 0) return;
    for (const media of medias) {
      this.em.remove(media);
    }
    await this.em.flush();
  }
}
