import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';

const FORMATS = {
  jpeg: { mime: 'image/jpeg', ext: '.jpg' },
  png: { mime: 'image/png', ext: '.png' },
  webp: { mime: 'image/webp', ext: '.webp' },
} as const;

export interface NormalizedImage {
  buffer: Buffer;
  mime: string;
  ext: string;
}

@Injectable()
export class ThumbnailService {
  private open(input: Buffer) {
    return sharp(input, { limitInputPixels: 40_000_000 });
  }

  /** Применяет EXIF-поворот, вырезает метаданные, ограничивает размер. Формат определяется по содержимому. */
  async normalize(input: Buffer): Promise<NormalizedImage> {
    const { data, info } = await this.open(input)
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer({ resolveWithObject: true });

    const format = FORMATS[info.format as keyof typeof FORMATS];
    if (!format) {
      throw new BadRequestException('Unsupported image format');
    }
    return { buffer: data, ...format };
  }

  thumbnail(input: Buffer): Promise<Buffer> {
    return this.open(input)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
  }
}
