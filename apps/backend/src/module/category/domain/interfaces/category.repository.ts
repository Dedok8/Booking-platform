import { Category } from '@/module/category/domain/entity/category.entity.js';
import { SORT_ORDER } from '@booking-platform/shared';

export interface ICreateCategoryData {
  name: string;
  slug: string;
}

export interface IUpdateCategoryData {
  name?: string;
  slug?: string;
  isActive?: boolean;
}

export interface ICategoryQuery {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy: string;
  sortOrder: SORT_ORDER;
}

export abstract class CategoryRepository {
  abstract findById(id: string): Promise<Category | null>;
  abstract findBySlug(slug: string): Promise<Category | null>;
  abstract existsBySlug(slug: string): Promise<boolean>;
  abstract findAll(
    query: ICategoryQuery,
  ): Promise<{ items: Category[]; total: number }>;
  abstract create(data: ICreateCategoryData): Category;
  abstract update(
    id: string,
    data: IUpdateCategoryData,
  ): Promise<Category | null>;
  abstract delete(id: Category): Promise<void>;
  abstract flush(): Promise<void>;
}
