import { StorageModule } from "@/core/storage/storage.module.js";
import { MediaService } from "@/module/media/application/media.service.js";
import { ThumbnailService } from "@/module/media/application/thumbnail.service.js";
import { MediaEntity } from "@/module/media/domain/entity/media.entity.js";
import { MediaRepository } from "@/module/media/domain/interfaces/media.repository.js";
import { OrmMediaRepository } from "@/module/media/infrastructure/orm-media.repository.js";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

@Module({
  imports: [MikroOrmModule.forFeature([MediaEntity]), StorageModule],
  providers: [
    MediaService,
    ThumbnailService,
    { provide: MediaRepository, useClass: OrmMediaRepository },
  ],
  exports: [MediaService],
})
export class MediaModule {}
