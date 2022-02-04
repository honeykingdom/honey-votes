import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from './authConstants';

export const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(LS_ACCESS_TOKEN, accessToken);
  localStorage.setItem(LS_REFRESH_TOKEN, refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem(LS_ACCESS_TOKEN);
  localStorage.removeItem(LS_REFRESH_TOKEN);
};
