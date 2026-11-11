export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    confirmEmail: "/auth/confirm-email",
    resendConfirmation: "/auth/resend-confirmation",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    me: "/auth/me",
    changePassword: "/auth/change-password",
  },
  users: {
    list: "/users",
    create: "/users",
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    updateRole: (id: string) => `/users/${id}/role`,
    remove: (id: string) => `/users/${id}`,
  },
  health: "/health",
} as const;
