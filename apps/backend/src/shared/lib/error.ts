import { ErrorCode } from '@booking-platform/shared';

export type ErrorParams = Record<string, string | number>;

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly params?: ErrorParams,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = new.target.name;
  }

  static notFound(message = 'Not found') {
    return new AppError(ErrorCode.NOT_FOUND, message);
  }
  static alreadyExists(message = 'Already exists') {
    return new AppError(ErrorCode.ALREADY_EXISTS, message);
  }
  static forbidden(message = 'Forbidden') {
    return new AppError(ErrorCode.FORBIDDEN, message);
  }
  static unauthorized(message = 'Unauthorized') {
    return new AppError(ErrorCode.UNAUTHORIZED, message);
  }
  static invalidCredentials() {
    return new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials');
  }
  static validationFailed(message = 'Validation failed') {
    return new AppError(ErrorCode.VALIDATION_FAILED, message);
  }
  static tooManyAttempts(message = 'Too many attempts') {
    return new AppError(ErrorCode.TOO_MANY_ATTEMPTS, message);
  }
  static codeExpired(message = 'Code expired') {
    return new AppError(ErrorCode.CODE_EXPIRED, message);
  }

  static invalidCode(message = 'Bad request') {
    return new AppError(ErrorCode.INVALID_CODE, message);
  }

  static emailNotVerified(message = 'Email not verified ') {
    return new AppError(ErrorCode.EMAIL_NOT_VERIFIED, message);
  }
}
