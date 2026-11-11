import type { USER_ROLE } from "@booking-platform/shared";

export interface IRouteMeta {
  title: string;
  isInMenu: boolean;
  requireAuth: boolean;
  isGuestOnly?: boolean;
  roles?: USER_ROLE[];
  icon?: string;
  order?: number;
}

export interface IRouteConfig {
  path: string;
  meta: IRouteMeta;
}

export interface IDynamicRouteConfig {
  path: (id: string) => string;
  meta: IRouteMeta;
}
