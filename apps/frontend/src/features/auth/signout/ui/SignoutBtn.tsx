import { useSignout } from "@/features/auth/signout/model";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";

function SignoutBtn() {
  const { signout, isLoading } = useSignout();
  const { t } = useTranslation();

  return (
    <Button onClick={() => signout()} disabled={isLoading}>
      {isLoading ? t("auth.signoutLoading") : t("auth.signout")}
    </Button>
  );
}

export default SignoutBtn;
