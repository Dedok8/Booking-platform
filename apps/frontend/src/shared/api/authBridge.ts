import type { AuthResponse } from "@booking-platform/shared";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";

type Dispatch = BaseQueryApi["dispatch"];

export interface IAuthBridge {
  getAccessToken: (state: unknown) => string | null | undefined;
  onRefreshed: (data: AuthResponse, dispatch: Dispatch) => void;
  onAuthFailed: (dispatch: Dispatch) => void;
}

let bridge: IAuthBridge = {
  getAccessToken: () => null,
  onRefreshed: () => {},
  onAuthFailed: () => {},
};

export const configureAuthBridge = (impl: IAuthBridge): void => {
  bridge = impl;
};

export const getAuthBridge = (): IAuthBridge => bridge;
