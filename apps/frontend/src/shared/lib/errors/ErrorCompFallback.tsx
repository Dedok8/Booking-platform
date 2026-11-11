import ErrorView from "@/shared/lib/errors/ErrorView";
import type { FallbackProps } from "react-error-boundary";

function ErrorCompFallback({ error, resetErrorBoundary }: FallbackProps) {
  const devMessage = error instanceof Error ? error.message : String(error);
  return <ErrorView devMessage={devMessage} onReset={resetErrorBoundary} />;
}

export default ErrorCompFallback;
