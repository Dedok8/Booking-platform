import { HashService } from '@/core/hash/hash.service.js';
import { RegisterDto } from '@/module/auth/application/dto/auth.dto.js';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserRoleInput,
} from '@/module/user/application/dto/user.dto.js';
import { User } from '@/module/user/domain/entities/user.entity.js';
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

  async findById(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw AppError.notFound('User not found');
    return user;
  }

  findByEmail(email: string): Promise<User | null> {
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

  register(dto: RegisterDto): Promise<User> {
    return this.createUser(dto, USER_ROLE.USER, null);
  }

  createByAdmin(input: CreateUserInput): Promise<User> {
    return this.createUser(
      input,
      input.role ?? USER_ROLE.USER,
      input.emailVerifiedAt ? new Date(input.emailVerifiedAt) : null,
    );
  }

  async markEmailVerified(id: string): Promise<User> {
    const user = await this.findById(id);
    user.emailVerifiedAt = new Date();
    await this.save();
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);
    user.name = input.name;
    if (input.bio !== undefined) user.bio = input.bio;
    await this.save();
    return user;
  }

  async updateRole(id: string, input: UpdateUserRoleInput): Promise<User> {
    const user = await this.findById(id);
    user.role = input.role;
    await this.save();
    return user;
  }

  async setPassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    user.passwordHash = await this.hash.hash(newPassword);
    await this.save();
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    this.users.delete(user);
    await this.save();
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async createUser(
    input: Pick<CreateUserInput, 'name' | 'email' | 'password'>,
    role: USER_ROLE,
    emailVerifiedAt: Date | null,
  ): Promise<User> {
    const email = this.normalizeEmail(input.email);

    if (await this.users.findByEmail(email)) {
      throw AppError.alreadyExists();
    }

    const user = this.users.create({
      name: input.name,
      email,
      passwordHash: await this.hash.hash(input.password),
      role,
      emailVerifiedAt,
    });

    await this.save();
    return user;
  }

  private async save(): Promise<void> {
    try {
      await this.users.flush();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw AppError.alreadyExists();
      }
      throw error;
    }
  }
}
