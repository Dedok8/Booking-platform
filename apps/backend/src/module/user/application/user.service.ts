import { HashService } from '@/core/hash/hash.service.js';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from '@/module/user/application/dto/user.dto.js';
import {
  IUserQuery,
  UserRepository,
} from '@/module/user/domain/interfaces/user.repository.js';
import { AppError } from '@/shared/lib/error.js';
import { USER_ROLE } from '@booking-platform/shared';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly users: UserRepository,
    private readonly hash: HashService,
  ) {}

  async findById(id: string) {
    const user = await this.users.findById(id);

    if (!user) throw AppError.notFound('User not found');

    return user;
  }

  async findByEmail(email: string) {
    return this.users.findByEmail(this.normalizeEmail(email));
  }

  async findAll(query: IUserQuery) {
    const { items, total } = await this.users.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      role: query.role,
    });

    return { items, total, page: query.page, limit: query.limit };
  }

  register(dto: CreateUserDto) {
    return this.createUser(dto, dto.role ?? USER_ROLE.USER, new Date());
  }

  async markEmailVerified(id: string) {
    const user = await this.findById(id);
    user.emailVerifiedAt = new Date();
    await this.save();
    return user;
  }

  async create(dto: CreateUserDto) {
    const email = this.normalizeEmail(dto.email);

    if (await this.users.findByEmail(email)) {
      throw AppError.alreadyExists();
    }

    const user = this.users.create({
      name: dto.name,
      email,
      passwordHash: dto.password,
      role: dto.role ?? USER_ROLE.USER,
      emailVerifiedAt: dto.emailVerifiedAt
        ? new Date(dto.emailVerifiedAt)
        : null,
    });

    await this.save();
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    user.name = dto.name;
    if (dto.bio !== undefined) user.bio = dto.bio;
    await this.save();
    return user;
  }

  async updateRole(id: string, dto: UpdateUserRoleDto) {
    const user = await this.findById(id);
    user.role = dto.role;

    await this.save();
    return user;
  }

  async setPassword(id: string, newPassword: string) {
    const user = await this.findById(id);
    user.passwordHash = await this.hash.hash(newPassword);
    await this.save();
  }

  async delete(id: string) {
    const user = await this.findById(id);
    this.users.delete(user);
    await this.save();
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async createUser(
    dto: CreateUserDto,
    role: USER_ROLE,
    emailVerifiedAt: Date | null,
  ) {
    const email = this.normalizeEmail(dto.email);

    if (await this.users.findByEmail(email)) {
      throw AppError.alreadyExists;
    }

    const user = this.users.create({
      name: dto.name,
      email,
      passwordHash: await this.hash.hash(dto.password),
      role,
      emailVerifiedAt,
    });
    await this.save();
    return user;
  }

  private async save() {
    try {
      await this.users.flush();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw AppError.alreadyExists;
      }
      throw error;
    }
  }
}
