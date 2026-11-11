import { CategoryService } from '@/module/category/application/category.service.js';
import {
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/module/category/application/dto/category.dto.js';
import { toCategoryDto } from '@/module/category/application/mapper/category.mapper.js';
import { Public } from '@/shared/decorators/public.decorator.js';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(private readonly categories: CategoryService) {}

  @Public()
  @Get()
  async getAll(@Query() query: CategoryQueryInput) {
    const { items, ...meta } = await this.categories.findAll(query);
    return { items: items.map(toCategoryDto), ...meta };
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return toCategoryDto(await this.categories.findById(id));
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return toCategoryDto(await this.categories.getPublicBySlug(slug));
  }

  @Post()
  async create(@Body() body: CreateCategoryInput) {
    return toCategoryDto(await this.categories.create(body));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryInput,
  ) {
    return toCategoryDto(await this.categories.update(id, body));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.categories.delete(id);
  }
}
