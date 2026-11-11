import { logout } from "@/entities/auth/model";
import { baseApi } from "@/shared/api";
import { API_ROUTES } from "@/shared/config/routes";
import type {
  AuthResponse,
  ChangePasswordInput,
  ConfirmEmailInput,
  LoginInput,
  RegisterInput,
  ResendConfirmationInput,
} from "@booking-platform/shared";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({
        url: API_ROUTES.auth.register,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    confirmEmail: build.mutation<AuthResponse, ConfirmEmailInput>({
      query: (body) => ({
        url: API_ROUTES.auth.confirmEmail,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    resendConfirmation: build.mutation<void, ResendConfirmationInput>({
      query: (body) => ({
        url: API_ROUTES.auth.resendConfirmation,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    login: build.mutation<AuthResponse, LoginInput>({
      query: (body) => ({
        url: API_ROUTES.auth.login,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    refresh: build.mutation<AuthResponse, void>({
      query: () => ({
        url: API_ROUTES.auth.refresh,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.auth.logout,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
        } finally {
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        }
      },
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    logoutAll: build.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.auth.logoutAll,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
        } finally {
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        }
      },
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),

    changePassword: build.mutation<AuthResponse, ChangePasswordInput>({
      query: (body) => ({
        url: API_ROUTES.auth.changePassword,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "USER" }],
    }),
  }),
});

export const {
  useLogoutMutation,
  useRefreshMutation,
  useChangePasswordMutation,
  useConfirmEmailMutation,
  useLoginMutation,
  useLogoutAllMutation,
  useRegisterMutation,
  useResendConfirmationMutation,
} = authApi;
