export function reportError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  console.error("[error]", error, context ?? "");
}

export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (import.meta.env.DEV) {
    console.error("[error]", error, context ?? "");
  }

  // В проде отправляем только в Sentry (когда подключите)
  // Sentry.captureException(error, { extra: context });
}
