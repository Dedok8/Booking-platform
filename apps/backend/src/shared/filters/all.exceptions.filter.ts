import { randomUUID } from 'node:crypto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import type { ZodError } from 'zod';
import { type ApiError, ErrorCode } from '@booking-platform/shared';
import { AppError } from '@/shared/lib/error.js';

const STATUS_BY_CODE: Record<ErrorCode, HttpStatus> = {
  NOT_FOUND: HttpStatus.NOT_FOUND,
  VALIDATION_FAILED: HttpStatus.BAD_REQUEST,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  ALREADY_EXISTS: HttpStatus.CONFLICT,
  CODE_EXPIRED: HttpStatus.GONE,
  TOO_MANY_ATTEMPTS: HttpStatus.TOO_MANY_REQUESTS,
  INSUFFICIENT_STOCK: HttpStatus.CONFLICT,
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  UNKNOWN: HttpStatus.INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  INVALID_CODE: HttpStatus.BAD_REQUEST,
  EMAIL_NOT_VERIFIED: HttpStatus.FORBIDDEN,
};

const CODE_BY_STATUS: Partial<Record<number, ErrorCode>> = {
  400: ErrorCode.VALIDATION_FAILED,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.ALREADY_EXISTS,
  410: ErrorCode.CODE_EXPIRED,
  429: ErrorCode.TOO_MANY_ATTEMPTS,
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const mapped = this.toApiError(exception);
    const requestId = randomUUID();

    const error: ApiError =
      mapped.statusCode >= 500
        ? {
            statusCode: mapped.statusCode,
            code: ErrorCode.INTERNAL_ERROR,
            message: 'Internal server error',
          }
        : mapped;

    if (error.statusCode >= 500) {
      this.logger.error(
        `[${requestId}] ${request.method} ${request.path}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${request.method} ${request.path} -> ${error.statusCode} ${error.code}`,
      );
    }

    response.setHeader('x-request-id', requestId);
    response.status(error.statusCode).json({
      ...error,
      requestId,
      path: request.path,
      timestamp: new Date().toISOString(),
    });
  }

  private toApiError(exception: unknown): ApiError {
    if (exception instanceof AppError) {
      return {
        statusCode: STATUS_BY_CODE[exception.code],
        code: exception.code,
        message: exception.code,
        params: exception.params,
      };
    }

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as ZodError;
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: ErrorCode.VALIDATION_FAILED,
        message: ErrorCode.VALIDATION_FAILED,
        errors: zodError.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      return {
        statusCode,
        code:
          CODE_BY_STATUS[statusCode] ??
          (statusCode >= 500 ? ErrorCode.INTERNAL_ERROR : ErrorCode.UNKNOWN),
        message: exception.message,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
    };
  }
}
