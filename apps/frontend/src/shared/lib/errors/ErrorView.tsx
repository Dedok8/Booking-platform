import { useTranslation } from "react-i18next";

interface ErrorViewProps {
  variant?: "generic" | "notFound";
  message?: string;
  devMessage?: string;
  onReset?: () => void;
  onHome?: () => void;
}

function ErrorView({
  variant = "generic",
  message,
  devMessage,
  onReset,
  onHome,
}: ErrorViewProps) {
  const { t } = useTranslation();
  const isNotFound = variant === "notFound";

  return (
    <div role="alert">
      <h2>{t(isNotFound ? "errors.notFoundTitle" : "errors.title")}</h2>
      <p>
        {message ?? t(isNotFound ? "errors.codes.NOT_FOUND" : "errors.generic")}
      </p>
      {import.meta.env.DEV && devMessage && <pre>{devMessage}</pre>}
      {isNotFound && onHome ? (
        <button onClick={onHome}>{t("errors.goHome")}</button>
      ) : (
        onReset && <button onClick={onReset}>{t("errors.retry")}</button>
      )}
    </div>
  );
}

export default ErrorView;
