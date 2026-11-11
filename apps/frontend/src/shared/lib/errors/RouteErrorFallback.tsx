import ErrorView from "@/shared/lib/errors/ErrorView";
import { isFetchBaseQueryError } from "@/shared/lib/errors/getErrorMessage";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

function getDevMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (isFetchBaseQueryError(error)) {
    const data =
      typeof error.data === "string" ? error.data : JSON.stringify(error.data);
    return `API error: ${error.status}${data ? ` ${data}` : ""}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <ErrorView
      variant={isNotFound ? "notFound" : "generic"}
      devMessage={getDevMessage(error)}
      onReset={() => navigate(0)}
      onHome={() => navigate("/")}
    />
  );
}

export default RouteErrorFallback;
