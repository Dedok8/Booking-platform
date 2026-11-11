import { CategoryService } from '@/module/category/application/category.service.js';
import { CategoryEntity } from '@/module/category/domain/entity/category.entity.js';
import { CategoryRepository } from '@/module/category/domain/interfaces/category.repository.js';
import { OrmCategoryRepository } from '@/module/category/infrastructure/orm-category-repository.js';
import { CategoryController } from '@/module/category/presentation/category.controller.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    { provide: CategoryRepository, useClass: OrmCategoryRepository },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
