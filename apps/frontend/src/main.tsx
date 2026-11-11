import { createRoot } from "react-dom/client";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorCompFallback from "@/shared/lib/errors/ErrorCompFallback";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/Router";

import { StrictMode } from "react";
import { logError } from "@/shared/lib/monitoring";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorCompFallback}
      onError={(error, info) =>
        logError(error, { componentStack: info.componentStack ?? undefined })
      }
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
