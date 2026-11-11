import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/module/category/application/dto/category.dto.js';
import {
  CategoryRepository,
  ICategoryQuery,
} from '@/module/category/domain/interfaces/category.repository.js';
import { AppError } from '@/shared/lib/error.js';
import { slugUniqueGenetator } from '@/shared/utils/slug.unique.generator.js';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categories: CategoryRepository) {}

  async findById(id: string) {
    const category = await this.categories.findById(id);

    if (!category) throw AppError.notFound('category not found');

    return category;
  }

  async getPublicBySlug(slug: string) {
    const category = await this.categories.findBySlug(slug);
    if (!category || !category.isActive) throw AppError.notFound();
    return category;
  }

  async findAll(query: ICategoryQuery) {
    const { items, total } = await this.categories.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      isActive: query.isActive,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return { items, total, page: query.page, limit: query.limit };
  }

  async create(input: CreateCategoryInput) {
    const slug = slugUniqueGenetator(
      input.name,
      (prefix) => this.categories.existsBySlug(prefix),
      { fallback: 'category' },
    );

    await this.save();
    return this.categories.create(input);
  }

  async update(id: string, input: UpdateCategoryInput) {
    const category = await this.findById(id);

    if (input.name !== undefined) category.name = input.name;
    if (input.isActive !== undefined) category.isActive = input.isActive;

    await this.save();

    return category;
  }

  async delete(id: string) {
    const category = await this.findById(id);

    this.categories.delete(category);
  }

  async save() {
    try {
      await this.categories.flush();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw AppError.alreadyExists();
      }
      throw error;
    }
  }
}
