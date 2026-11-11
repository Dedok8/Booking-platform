import { useTranslation } from "react-i18next";
import ErrorView from "./ErrorView";
import { getErrorMessage } from "./getErrorMessage";

interface QueryErrorViewProps {
  error: unknown;
  onRetry?: () => void;
}

function QueryErrorView({ error, onRetry }: QueryErrorViewProps) {
  const { t } = useTranslation();
  return (
    <ErrorView
      message={getErrorMessage(error, t)}
      devMessage={JSON.stringify(error, null, 2)}
      onReset={onRetry}
    />
  );
}

export default QueryErrorView;
