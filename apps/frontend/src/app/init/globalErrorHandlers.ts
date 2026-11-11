import { reportError } from "@/shared/lib/monitoring";

const RELOAD_FLAG = "vite-preload-reloaded";

export function initGlobalErrorHandlers(): void {
  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, { source: "unhandledrejection" });
  });

  window.addEventListener("error", (event) => {
    reportError(event.error ?? event.message, { source: "window.error" });
  });

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    if (!sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
    } else {
      reportError((event as Event & { payload?: unknown }).payload, {
        source: "vite:preloadError",
      });
    }
  });

  window.addEventListener("load", () => sessionStorage.removeItem(RELOAD_FLAG));
}
