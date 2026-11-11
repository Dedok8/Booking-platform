import { authApi } from "@/entities/auth/api";
import { logout, setCredentials } from "@/entities/auth/model";

import { getErrorCode } from "@/shared/lib/errors/getErrorMessage";
import { TOKENS_ERROR_CODE } from "@/shared/lib/tokens";
import type { AppStore } from "@/shared/types/appTypes";

interface IBootSessionLoaderDeps {
  store: AppStore;
}

export const bootSessionLoader =
  ({ store }: IBootSessionLoaderDeps) =>
  async (): Promise<null> => {
    const { accessToken } = store.getState().auth;
    if (accessToken) return null;

    try {
      const data = await store
        .dispatch(authApi.endpoints.refresh.initiate())
        .unwrap();
      store.dispatch(setCredentials(data));
    } catch (e) {
      const code = getErrorCode(e);

      if (code && TOKENS_ERROR_CODE.includes(code)) {
        store.dispatch(logout());
      } else {
        throw e;
      }
    }

    return null;
  };
