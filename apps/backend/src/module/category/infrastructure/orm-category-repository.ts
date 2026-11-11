import {
  Category,
  CategoryEntity,
} from '@/module/category/domain/entity/category.entity.js';
import {
  CategoryRepository,
  ICategoryQuery,
  ICreateCategoryData,
  IUpdateCategoryData,
} from '@/module/category/domain/interfaces/category.repository.js';
import { escapeLike } from '@/shared/lib/escape-like.js';
import { FlushClass } from '@/shared/utils/flush.js';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmCategoryRepository implements CategoryRepository, FlushClass {
  constructor(private readonly em: EntityManager) {}

  findById(id: string): Promise<Category | null> {
    return this.em.findOne(CategoryEntity, { id });
  }

  async findAll(
    query: ICategoryQuery,
  ): Promise<{ items: Category[]; total: number }> {
    const { page, limit, search, isActive, sortBy, sortOrder } = query;

    const where: FilterQuery<Category> = {};

    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      where.$or = [{ name: { $ilike: pattern } }];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await this.em.findAndCount(CategoryEntity, where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: [{ [sortBy]: sortOrder }, { id: 'asc' }],
    });

    return { items, total };
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.em.findOne(CategoryEntity, { slug });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    return (await this.em.count(CategoryEntity, { slug })) > 0;
  }

  create(data: ICreateCategoryData): Category {
    const category = this.em.create(CategoryEntity, data);
    this.em.persist(category);
    return category;
  }

  async update(
    id: string,
    data: IUpdateCategoryData,
  ): Promise<Category | null> {
    const category = await this.em.findOne(CategoryEntity, { id });

    if (!category) return null;

    this.em.assign(category, data);

    return category;
  }

  async delete(category: Category): Promise<void> {
    this.em.remove(category);
  }

  async flush(): Promise<void> {
    this.em.flush();
  }
}
