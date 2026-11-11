import { CreateMediaSchema, MediaDtoSchema } from '@booking-platform/shared';
import { createZodDto } from 'nestjs-zod';

export class MediaDtoInput extends createZodDto(MediaDtoSchema) {}
export class CreateMediaInput extends createZodDto(CreateMediaSchema) {}
