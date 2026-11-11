import { useResendConfirmationMutation } from "@/entities/auth/api";
import type { ResendConfirmationInput } from "@booking-platform/shared";

export const useResendEmail = () => {
  const [resendEmailMutation, { isLoading }] = useResendConfirmationMutation();

  async function resendEmail(credential: ResendConfirmationInput) {
    const data = await resendEmailMutation(credential).unwrap();

    return data;
  }

  return { resendEmail, isLoading };
};
