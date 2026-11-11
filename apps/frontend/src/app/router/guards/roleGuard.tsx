import { FRONT_ROUTES } from "@/shared/config/routes";
import { useAppSelector } from "@/shared/hooks/app";

import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const user = useAppSelector((a) => a.auth.user);
  return user ? (
    <Outlet />
  ) : (
    <Navigate to={FRONT_ROUTES.pages.Login.path} replace />
  );
}

export function IsGuestOnly() {
  const user = useAppSelector((a) => a.auth.user);
  return user ? (
    <Navigate to={FRONT_ROUTES.pages.Profile.path} replace />
  ) : (
    <Outlet />
  );
}

export function RequireRole({ roles }: { roles: string[] }) {
  const user = useAppSelector((a) => a.auth.user);

  return user && roles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to={FRONT_ROUTES.pages.Forbidden.path} replace />
  );
}
