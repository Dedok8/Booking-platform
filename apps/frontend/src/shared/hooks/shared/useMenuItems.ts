import {
  HomeIcon,
  UserIcon,
  LayoutDashboardIcon,
  type LucideIcon,
} from "lucide-react";

import { useAppSelector } from "@/shared/hooks/app";
import type { IRouteMeta } from "@/shared/types";
import { getMenuItems } from "@/shared/config/routes";

const ICONS: Record<string, LucideIcon> = {
  home: HomeIcon,
  user: UserIcon,
  dashboard: LayoutDashboardIcon,
};

export function useMenuItems(): {
  title: string;
  url: string;
  icon: LucideIcon;
}[] {
  const user = useAppSelector((s) => s.auth.user);

  return getMenuItems({
    isAuthenticated: !!user,
    userRole: user?.role,
  }).map((page) => {
    const meta = page.meta as IRouteMeta;
    return {
      title: meta.title,
      url: page.path,
      icon: ICONS[meta.icon ?? ""] ?? LayoutDashboardIcon,
    };
  });
}
