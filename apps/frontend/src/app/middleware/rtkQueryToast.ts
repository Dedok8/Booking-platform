import { getErrorMessage } from "@/shared/lib/errors/getErrorMessage";
import { reportError } from "@/shared/lib/monitoring";
import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import i18next from "i18next";
import { toast } from "sonner";

const SILENT_ENDPOINTS = new Set(["logout", "refresh"]);

export const rtkQueryErrorToast: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const arg = action.meta.arg as { type?: string; endpointName?: string };
    const status = (action.payload as { status?: unknown } | undefined)?.status;

    if (typeof status === "number" && status >= 500) {
      reportError(action.payload, { endpoint: arg.endpointName });
    }

    const silent = arg.endpointName && SILENT_ENDPOINTS.has(arg.endpointName);
    if (arg.type === "mutation" && status !== 401 && !silent) {
      toast.error(getErrorMessage(action.payload, i18next.t));
    }
  }

  return next(action);
};
