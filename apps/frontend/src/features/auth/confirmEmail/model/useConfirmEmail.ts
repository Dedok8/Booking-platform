import { useConfirmEmailMutation } from "@/entities/auth/api";
import { setCredentials } from "@/entities/auth/model";

import { useAppDispatch } from "@/shared/hooks/app";
import type { ConfirmEmailInput } from "@booking-platform/shared";

export const useConfirmEmail = () => {
  const [confirmEmailMutation, { isLoading }] = useConfirmEmailMutation();

  const dispatch = useAppDispatch();

  async function confirmEmail(credential: ConfirmEmailInput) {
    const data = await confirmEmailMutation(credential).unwrap();
    dispatch(setCredentials(data));

    return data;
  }

  return { confirmEmail, isLoading };
};
