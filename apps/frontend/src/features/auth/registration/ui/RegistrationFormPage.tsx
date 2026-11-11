import {
  useRegistration,
  useRegistrationForm,
} from "@/features/auth/registration/model";
import { FRONT_ROUTES } from "@/shared/config/routes";
import { applyServerError, FORMS_ERROR_CODE } from "@/shared/lib/form";
import { SignupForm } from "@/shared/ui/signup-form";
import type { RegisterFormInput } from "@booking-platform/shared";

import { useTranslation } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";

function RegistrationFormPage() {
  const { registration, isLoading } = useRegistration();
  const { register, handleSubmit, errors, setError } = useRegistrationForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSubmit = async ({
    confirmPassword,
    ...values
  }: RegisterFormInput) => {
    try {
      await registration({ ...values, confirmPassword });
      navigate({
        pathname: FRONT_ROUTES.pages.ConfirmEmail.path,
        search: createSearchParams({ email: values.email }).toString(),
      });
    } catch (e) {
      applyServerError(e, t, FORMS_ERROR_CODE, setError);
    }
  };

  return (
    <SignupForm
      t={t}
      register={register}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit, (errs) => console.log("invalid:", errs))}
    />
  );
}

export default RegistrationFormPage;
