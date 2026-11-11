import {
  ChangePasswordSchema,
  ConfirmEmailSchema,
  LoginSchema,
  ResendConfirmationSchema,
  RegisterFormSchema,
} from '@booking-platform/shared';
import { createZodDto } from 'nestjs-zod';

export class RegisterDto extends createZodDto(RegisterFormSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class ConfirmEmailDto extends createZodDto(ConfirmEmailSchema) {}
export class ResendConfirmationDto extends createZodDto(
  ResendConfirmationSchema,
) {}
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
