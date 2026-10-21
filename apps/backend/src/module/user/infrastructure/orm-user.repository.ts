import { UserQueryDto } from '@/module/user/application/dto/user.dto.js';
import { User, UserEntity } from '@/module/user/domain/entities/user.entity.js';
import {
  ICreateUserData,
  IUpdateUserData,
  IUserQuery,
  UserRepository,
} from '@/module/user/domain/interfaces/user.repository.js';
import { escapeLike } from '@/shared/lib/escape-like.js';

import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  findById(id: string): Promise<User | null> {
    return this.em.findOne(UserEntity, { id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(UserEntity, { email });
  }

  async findAll(query: IUserQuery) {
    const { limit, page, search, sortBy, sortOrder, role } = query;

    const where: FilterQuery<User> = {};
    if (role) where.role = role;
    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      where.$or = [
        { name: { $ilike: pattern } },
        { email: { $ilike: pattern } },
        { role: { $ilike: pattern } },
      ];
    }

    const [items, total] = await this.em.findAndCount(UserEntity, where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: [{ [sortBy]: sortOrder }, { id: 'asc' }],
    });
    return { items, total };
  }

  create(data: ICreateUserData): User {
    const user = this.em.create(UserEntity, data);
    this.em.persist(user);
    return user;
  }

  async update(id: string, data: IUpdateUserData): Promise<User | null> {
    const user = await this.em.findOne(UserEntity, { id });

    if (!user) return null;

    this.em.assign(user, data);

    return user;
  }

  async delete(user: User): Promise<void> {
    this.em.remove(user);
  }

  flush(): Promise<void> {
    return this.em.flush();
  }
}
