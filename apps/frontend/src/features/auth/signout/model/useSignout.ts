import { useLogoutMutation } from "@/entities/auth/api";
import { logout } from "@/entities/auth/model";
import { baseApi } from "@/shared/api";
import { FRONT_ROUTES } from "@/shared/config/routes";
import { useAppDispatch } from "@/shared/hooks/app";
import { useNavigate } from "react-router-dom";

export const useSignout = () => {
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function signout() {
    try {
      await logoutMutation().unwrap();
    } catch {
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate(FRONT_ROUTES.pages.Login.path, { replace: true });
    }
  }

  return { signout, isLoading };
};
