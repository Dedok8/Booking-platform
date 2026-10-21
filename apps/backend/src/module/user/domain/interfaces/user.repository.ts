import { User } from '@/module/user/domain/entities/user.entity.js';
import { SORT_ORDER, USER_ROLE } from '@booking-platform/shared';

export interface ICreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role: USER_ROLE;
  emailVerifiedAt: Date | null;
}

export interface IUpdateUserData {
  name?: string;
  email?: string;
  passwordHash?: string;
  refreshToken?: string | null;
}

export interface IUserQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy: string;
  sortOrder: SORT_ORDER;
  role?: USER_ROLE;
}

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(
    query: IUserQuery,
  ): Promise<{ items: User[]; total: number }>;
  abstract create(data: ICreateUserData): User;
  abstract update(id: string, data: IUpdateUserData): Promise<User | null>;
  abstract delete(user: User): Promise<void>;
  abstract flush(): Promise<void>;
}
