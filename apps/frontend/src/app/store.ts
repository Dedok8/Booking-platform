import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  logout,
  setCredentials,
  type IUserSlice,
} from "@/entities/auth/model/authSlice";
import { baseApi } from "@/shared/api";
import { configureAuthBridge } from "@/shared/api/authBridge";
import { rtkQueryErrorToast } from "@/app/middleware/rtkQueryToast";

configureAuthBridge({
  getAccessToken: (state) => (state as { auth: IUserSlice }).auth.accessToken,
  onRefreshed: (data, dispatch) =>
    dispatch(
      setCredentials({ user: data.user, accessToken: data.accessToken })
    ),
  onAuthFailed: (dispatch) => dispatch(logout()),
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddelware) =>
    getDefaultMiddelware({ serializableCheck: true }).concat(
      baseApi.middleware,
      rtkQueryErrorToast
    ),
});
