import { USER_ROLE } from '@booking-platform/shared';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: USER_ROLE[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
