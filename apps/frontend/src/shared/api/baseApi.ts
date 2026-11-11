import { logout, setCredentials, type IUserSlice } from "@/entities/auth/model";
import { mainConfig } from "@/shared/config/mainConfig";
import { API_ROUTES } from "@/shared/config/routes";

import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AuthResponse } from "@booking-platform/shared";

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: mainConfig.BASE_URL,

  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: IUserSlice }).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.data && typeof result.data === "object" && "data" in result.data) {
    return { ...result, data: (result.data as { data: unknown }).data };
  }

  return result;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    typeof args !== "string" &&
    args.url !== API_ROUTES.auth.refresh
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: API_ROUTES.auth.refresh,
            method: "POST",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const data = refreshResult.data as AuthResponse;
          api.dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken })
          );

          result = await baseQuery(args, api, extraOptions);
        } else if ([401, 403].includes(refreshResult.error?.status as number)) {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["Auth", "User"],

  endpoints: () => ({}),
});
