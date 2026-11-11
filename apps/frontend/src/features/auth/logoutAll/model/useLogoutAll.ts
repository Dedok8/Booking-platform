import { useLogoutAllMutation } from "@/entities/auth/api";
import { FRONT_ROUTES } from "@/shared/config/routes";
import { useNavigate } from "react-router-dom";

export const useLogoutAll = () => {
  const [logoutAllMutation, { isLoading }] = useLogoutAllMutation();
  const navigate = useNavigate();

  async function logoutAll() {
    try {
      await logoutAllMutation().unwrap();
    } finally {
      navigate(FRONT_ROUTES.pages.Login.path, { replace: true });
    }
  }

  return { logoutAll, isLoading };
};
