import { ErrorCode } from "@booking-platform/shared";

export const EMAIL_ERROR_CODE: ErrorCode[] = [
  ErrorCode.INVALID_CODE,
  ErrorCode.CODE_EXPIRED,
  ErrorCode.TOO_MANY_ATTEMPTS,
  ErrorCode.VALIDATION_FAILED,
];
