import { UserDto } from '@/module/user/application/dto/user.dto.js';
import { User } from '@/module/user/domain/entities/user.entity.js';

export const toUserDto = (user: User): UserDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio ?? null,
  createdAt: user.createdAt.toISOString(),
});
