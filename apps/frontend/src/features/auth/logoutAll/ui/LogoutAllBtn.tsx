import { useLogoutAll } from "@/features/auth/logoutAll/model";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";

function LogoutAllBtn() {
  const { logoutAll, isLoading } = useLogoutAll();
  const { t } = useTranslation();

  return (
    <Button onClick={() => logoutAll()} disabled={isLoading}>
      {isLoading ? t("auth.logoutAll") : t("auth.logoutAllLoading")}
    </Button>
  );
}

export default LogoutAllBtn;
