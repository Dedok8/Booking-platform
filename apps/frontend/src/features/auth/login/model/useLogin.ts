import { useLoginMutation } from "@/entities/auth/api";
import { setCredentials } from "@/entities/auth/model";
import { useAppDispatch } from "@/shared/hooks/app";
import type { LoginInput } from "@booking-platform/shared";

export const useLogin = () => {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  async function login(credentials: LoginInput) {
    const data = await loginMutation(credentials).unwrap();

    dispatch(setCredentials(data));
  }
  return { login, isLoading };
};
