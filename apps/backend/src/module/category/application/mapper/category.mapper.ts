import { CategoryDto } from '@/module/category/application/dto/category.dto.js';
import { Category } from '@/module/category/domain/entity/category.entity.js';

export const toCategoryDto = (category: Category): CategoryDto => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  isActive: category.isActive,
  createdAt: category.createdAt.toISOString(),
});
