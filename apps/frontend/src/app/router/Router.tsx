import { appRouterRoutes } from "@/app/router/appRouterRoutes";
import { bootSessionLoader } from "@/app/router/bootSessionLoader";
import { IsGuestOnly, RequireAuth, RequireRole } from "@/app/router/guards";
import { store } from "@/app/store";
import RouteErrorFallback from "@/shared/lib/errors/RouteErrorFallback";
import type { IRouteMeta } from "@/shared/types";
import { SpinnerButton } from "@/shared/ui/spinner-button";
import MainLayout from "@/widgets/layouts/Mainlayout";
import PublicLayout from "@/widgets/layouts/PublicLayout";
import RootLayout from "@/widgets/layouts/RootLayouts";
import { createBrowserRouter } from "react-router-dom";

const authRoutes = appRouterRoutes.filter((r) => r.meta.requireAuth);

const plainAuthRoutes = authRoutes.filter(
  (r) => !(r.meta as IRouteMeta).roles?.length
);

const roleRouteGroups = new Map<
  string,
  { roles: string[]; routes: typeof authRoutes }
>();

for (const route of authRoutes) {
  const roles = (route.meta as IRouteMeta).roles;
  if (!roles?.length) continue;
  const key = [...roles].sort().join(",");
  const group = roleRouteGroups.get(key);
  if (group) {
    group.routes.push(route);
  } else {
    roleRouteGroups.set(key, { roles, routes: [route] });
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    loader: bootSessionLoader({ store }),
    HydrateFallback: SpinnerButton,
    shouldRevalidate: () => false,
    children: [
      {
        element: <IsGuestOnly />,
        children: [
          {
            element: <PublicLayout />,
            children: appRouterRoutes.filter((g) => g.meta.isGuestOnly),
          },
        ],
      },

      {
        element: <RequireAuth />,
        children: [
          {
            element: <MainLayout />,
            children: [
              ...plainAuthRoutes,
              ...[...roleRouteGroups.values()].map(({ routes, roles }) => ({
                element: <RequireRole roles={roles} />,
                children: routes,
              })),
            ],
          },
        ],
      },

      ...appRouterRoutes.filter(
        (r) => !r.meta.requireAuth && !(r.meta as IRouteMeta).isGuestOnly
      ),
    ],
  },
]);
