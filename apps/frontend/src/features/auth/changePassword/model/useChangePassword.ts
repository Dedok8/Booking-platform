import { useChangePasswordMutation } from "@/entities/auth/api";
import type { ChangePasswordInput } from "@booking-platform/shared";

export const useChangePassword = () => {
  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

  async function changePassword(credentials: ChangePasswordInput) {
    await changePasswordMutation(credentials).unwrap();
  }

  return { changePassword, isLoading };
};
