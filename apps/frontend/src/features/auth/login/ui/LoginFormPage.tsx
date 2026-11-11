import { useLogin } from "@/features/auth/login/model/useLogin";
import { useLoginForm } from "@/features/auth/login/model/useLoginForm";
import { FRONT_ROUTES } from "@/shared/config/routes";

import { applyServerError } from "@/shared/lib/form";
import { FORMS_ERROR_CODE } from "@/shared/lib/form/formsErrorCode";
import { LoginForm } from "@/shared/ui/login-form";
import type { LoginInput } from "@booking-platform/shared";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function LoginFormPage() {
  const { login, isLoading } = useLogin();
  const { register, handleSubmit, errors, setError } = useLoginForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (values: LoginInput) => {
    try {
      await login(values);
      navigate(FRONT_ROUTES.pages.Profile.path);
    } catch (e) {
      applyServerError(e, t, FORMS_ERROR_CODE, setError);
    }
  };

  return (
    <LoginForm
      register={register}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
      t={t}
    />
  );
}

export default LoginFormPage;
