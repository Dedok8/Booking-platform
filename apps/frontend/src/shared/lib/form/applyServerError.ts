import {
  getErrorCode,
  getErrorMessage,
} from "@/shared/lib/errors/getErrorMessage";
import type { ErrorCode } from "@booking-platform/shared";
import type { TFunction } from "i18next";
import type { FieldValues, UseFormSetError } from "react-hook-form";

export function applyServerError<T extends FieldValues>(
  e: unknown,
  t: TFunction,
  codes: readonly ErrorCode[],
  setError: UseFormSetError<T>
) {
  const code = getErrorCode(e);

  if (!code || !codes.includes(code)) return false;

  if (code && codes.includes(code)) {
    setError("root.serverError", { message: getErrorMessage(e, t) });
    return true;
  }
}
