import {
  ChangePasswordSchema,
  CreateUserSchema,
  SearchUserSchema,
  UpdateUserRoleSchema,
  UpdateUserSchema,
  UserDtoSchema,
  UserQuerySchema,
} from '@booking-platform/shared';
import { createZodDto } from 'nestjs-zod';

export class UserDto extends createZodDto(UserDtoSchema) {}
export class UserQueryInput extends createZodDto(UserQuerySchema) {}
export class ChangePasswordInput extends createZodDto(ChangePasswordSchema) {}
export class CreateUserInput extends createZodDto(CreateUserSchema) {}
export class SearchUserInput extends createZodDto(SearchUserSchema) {}
export class UpdateUserRoleInput extends createZodDto(UpdateUserRoleSchema) {}
export class UpdateUserInput extends createZodDto(UpdateUserSchema) {}
