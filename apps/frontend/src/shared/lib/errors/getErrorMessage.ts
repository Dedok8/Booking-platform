import { ErrorCode } from "@booking-platform/shared";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { TFunction } from "i18next";

const ERROR_CODES = new Set<string>(Object.values(ErrorCode));

interface IApiErrorBody {
  code?: string;
  message?: string | string[];
}

export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && ERROR_CODES.has(value);
}

function getApiErrorBody(
  error: FetchBaseQueryError
): IApiErrorBody | undefined {
  const data = error.data;
  return typeof data === "object" && data !== null
    ? (data as IApiErrorBody)
    : undefined;
}

export function getErrorCode(error: unknown): ErrorCode | undefined {
  if (!isFetchBaseQueryError(error)) return undefined;
  const code = getApiErrorBody(error)?.code;
  return isErrorCode(code) ? code : undefined;
}

export function getErrorMessage(error: unknown, t: TFunction): string {
  if (isFetchBaseQueryError(error)) {
    switch (error.status) {
      case "FETCH_ERROR":
        return t("errors.network");
      case "TIMEOUT_ERROR":
        return t("errors.timeout");
      case "PARSING_ERROR":
        return t("errors.badResponse");
      case "CUSTOM_ERROR":
        return t("errors.generic");
    }

    const code = getErrorCode(error);
    const body = getApiErrorBody(error);

    if (code === ErrorCode.VALIDATION_FAILED && body?.message) {
      return Array.isArray(body.message)
        ? body.message.join("\n")
        : body.message;
    }

    if (code) return t(`errors.codes.${code}`);

    if (error.status === 403) return t("errors.codes.FORBIDDEN");
    if (error.status === 404) return t("errors.codes.NOT_FOUND");
    if (typeof error.status === "number" && error.status >= 500) {
      return t("errors.server");
    }
  }

  return t("errors.generic");
}
