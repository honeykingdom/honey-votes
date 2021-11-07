import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from "./authConstants";

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem(LS_ACCESS_TOKEN)
      : null,
  refreshToken:
    typeof window !== "undefined"
      ? localStorage.getItem(LS_REFRESH_TOKEN)
      : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateTokens: (state, { payload }: PayloadAction<AuthState>) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { updateTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;
