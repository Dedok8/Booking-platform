/**
 * Единый реестр маршрутов приложения.
 * Структура сгруппирована по смыслу, а не по алфавиту/порядку добавления —
 * так проще найти нужный роут, когда их станет ещё больше.
 *
 * meta-поля:
 * - title         — заголовок страницы / пункта меню
 * - isInMenu      — показывать ли пункт в навигационном меню
 * - requireAuth   — доступен только авторизованным пользователям
 * - isGuestOnly   — доступен только НЕавторизованным (гостям) — прежнее
 *                   значение сохранено как есть, хотя логически это скорее
 *                   баг у некоторых публичных страниц (см. заметку ниже)
 * - roles         — список ролей, которым разрешён доступ (сейчас только ADMIN)
 * - order         — порядок сортировки в меню (чем меньше — тем выше)
 * - icon          — иконка пункта меню
 */

import type { IRouteMeta } from "@/shared/types";
import type { USER_ROLE } from "@booking-platform/shared";

export const FRONT_ROUTES = {
  pages: {
    Home: {
      path: "/",
      meta: {
        title: "HomePage",
        isInMenu: false,
        requireAuth: false,
        order: 1,
        icon: "home",
      },
    },

    Profile: {
      path: "/profile",
      meta: {
        title: "Profile",
        isInMenu: true,
        requireAuth: true,
        order: 2,
        icon: "user",
      },
    },

    Authentication: {
      path: "/authentication",
      meta: {
        title: "Authentication",
        isInMenu: true,
        requireAuth: false,
        isGuestOnly: true,
      },
    },

    Login: {
      path: "/login",
      meta: {
        title: "Login",
        isInMenu: false,
        requireAuth: false,
        isGuestOnly: true,
      },
    },

    Registration: {
      path: "/registration",
      meta: {
        title: "Registration",
        isInMenu: false,
        requireAuth: false,
        isGuestOnly: true,
      },
    },

    ConfirmEmail: {
      path: "/confirmEmail",
      meta: {
        title: "ConfirmEmail",
        isInMenu: false,
        requireAuth: false,
        isGuestOnly: true,
      },
    },
    ChangePassword: {
      path: "/changePassword",
      meta: {
        title: "ChangePassword",
        isInMenu: false,
        requireAuth: true,
        isGuestOnly: false,
      },
    },

    Forbidden: {
      path: "*",
      meta: {
        title: "Forbidden",
        isInMenu: false,
        requireAuth: false,
        isGuestOnly: false,
      },
    },
  },
} as const;

type Ctx = { isAuthenticated: boolean; userRole?: USER_ROLE | null };

const isVisible = (meta: IRouteMeta, { isAuthenticated, userRole }: Ctx) => {
  if (!meta.isInMenu) return false;
  if (meta.requireAuth && !isAuthenticated) return false;
  if (meta.isGuestOnly && isAuthenticated) return false;
  if (meta.roles?.length) {
    return !!userRole && meta.roles.includes(userRole);
  }
  return true;
};

export function getMenuItems(ctx: Ctx) {
  return Object.values(FRONT_ROUTES.pages)
    .filter((page) => isVisible(page.meta as IRouteMeta, ctx))
    .sort(
      (a, b) =>
        ((a.meta as IRouteMeta).order ?? 99) -
        ((b.meta as IRouteMeta).order ?? 99)
    );
}
