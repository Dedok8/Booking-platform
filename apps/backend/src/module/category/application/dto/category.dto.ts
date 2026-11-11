import {
  CategoryDtoSchema,
  CategoryQuerySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from '@booking-platform/shared';
import { createZodDto } from 'nestjs-zod';

export class CategoryDto extends createZodDto(CategoryDtoSchema) {}
export class CategoryQueryInput extends createZodDto(CategoryQuerySchema) {}
export class CreateCategoryInput extends createZodDto(CreateCategorySchema) {}
export class UpdateCategoryInput extends createZodDto(UpdateCategorySchema) {}
