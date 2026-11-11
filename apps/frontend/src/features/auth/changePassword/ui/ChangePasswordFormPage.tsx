import {
  useChangePassword,
  useChangePasswordForm,
} from "@/features/auth/changePassword/model";
import { FRONT_ROUTES } from "@/shared/config/routes";
import { applyServerError, FORMS_ERROR_CODE } from "@/shared/lib/form";
import { ChangePasswordForm } from "@/shared/ui/change-password-form";
import type { ChangePasswordInput } from "@booking-platform/shared";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ChangePasswordFormPage() {
  const { changePassword, isLoading } = useChangePassword();
  const { register, handleSubmit, errors, setError } = useChangePasswordForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (values: ChangePasswordInput) => {
    try {
      await changePassword(values);
      navigate(FRONT_ROUTES.pages.Profile.path);
    } catch (e) {
      applyServerError(e, t, FORMS_ERROR_CODE, setError);
    }
  };

  return (
    <ChangePasswordForm
      register={register}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
      t={t}
    />
  );
}

export default ChangePasswordFormPage;
