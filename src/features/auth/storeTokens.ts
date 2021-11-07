import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from "./authConstants";

const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(LS_ACCESS_TOKEN, accessToken);
  localStorage.setItem(LS_REFRESH_TOKEN, refreshToken);
};

export default storeTokens;
