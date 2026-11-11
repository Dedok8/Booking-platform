import {
  useConfirmEmail,
  useConfirmEmailForm,
} from "@/features/auth/confirmEmail/model";
import { useResendEmail } from "@/features/auth/resendEmail/model";
import { FRONT_ROUTES } from "@/shared/config/routes";
import { useResendCooldown } from "@/shared/hooks/shared";
import { getErrorMessage } from "@/shared/lib/errors/getErrorMessage";
import { applyServerError, EMAIL_ERROR_CODE } from "@/shared/lib/form";

import VerifyEmail from "@/shared/ui/verify-email";
import type { ConfirmEmailInput } from "@booking-platform/shared";

import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function ConfirmEmailFormPage() {
  const [params] = useSearchParams();
  const email = params.get("email");

  const { confirmEmail, isLoading } = useConfirmEmail();
  const { register, handleSubmit, errors, setError } = useConfirmEmailForm(
    email ?? ""
  );
  const { resendEmail } = useResendEmail();

  const { seconds, start } = useResendCooldown();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!email)
    return <Navigate to={FRONT_ROUTES.pages.Registration.path} replace />;

  const onSubmit = async (values: ConfirmEmailInput) => {
    try {
      await confirmEmail(values);
      navigate(FRONT_ROUTES.pages.Profile.path);
    } catch (e) {
      applyServerError(e, t, EMAIL_ERROR_CODE, setError);
    }
  };

  const onResend = async () => {
    if (seconds > 0) return;

    try {
      await resendEmail({ email });
      start(60);
    } catch (e) {
      toast.error(getErrorMessage(e, t));
    }
  };
  return (
    <VerifyEmail
      t={t}
      register={register}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
      onResend={onResend}
      resendCooldown={seconds}
      email={email}
    />
  );
}

export default ConfirmEmailFormPage;
