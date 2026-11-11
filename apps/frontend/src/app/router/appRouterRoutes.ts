import { FRONT_ROUTES } from "@/shared/config/routes/FRONT_ROUTES";
import type { IRouteMeta } from "@/shared/types";
import type { FC } from "react";

type PageModule = {
  default: FC;
};

const pages = import.meta.glob<PageModule>("../../pages/**/index.ts");

const pagesList = Object.keys(FRONT_ROUTES.pages) as Array<
  keyof typeof FRONT_ROUTES.pages
>;

type RouteLike = { path?: unknown; template?: string; meta: IRouteMeta };

export const appRouterRoutes = pagesList.map((page) => {
  const route: RouteLike = FRONT_ROUTES.pages[page];

  const path =
    route.template ?? (typeof route.path === "string" ? route.path : undefined);

  const isIndex = path === "/";

  return {
    ...(isIndex ? { index: true } : { path }),
    meta: route.meta,

    lazy: async () => {
      const match = Object.keys(pages).find((p) =>
        p.toLowerCase().includes(`/${page.toLowerCase()}/index.ts`)
      );
      console.log("pages keys:", Object.keys(pages), "looking for:", page);
      if (!match) throw new Error(`Page "${page}" не знайдена в /pages`);

      const module = await pages[match]();

      console.log("route config:", page, { path, isIndex, meta: route.meta });

      return { Component: module.default };
    },
  };
});
