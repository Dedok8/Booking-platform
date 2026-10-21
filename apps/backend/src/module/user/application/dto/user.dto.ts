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
export class UserQueryDto extends createZodDto(UserQuerySchema) {}
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class SearchUserDto extends createZodDto(SearchUserSchema) {}
export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
