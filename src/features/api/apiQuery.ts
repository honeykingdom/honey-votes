import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import jwtDecode from "jwt-decode";
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from "utils/constants";
import storeTokens from "utils/storeTokens";
import { API_BASE, API_BASE_POSTGREST, SUPABASE_HEADERS } from "./apiConstants";
import { Jwt, RefreshTokenResponse } from "./types";

const baseQuery = fetchBaseQuery({ baseUrl: "" });

const getApiHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(LS_ACCESS_TOKEN)}`,
});

const getRefreshTokenQuery = () => ({
  url: `${API_BASE}/auth/refresh-token`,
  method: "POST",
  body: { refreshToken: localStorage.getItem(LS_REFRESH_TOKEN) },
});

const addHeadersToFetchArgs = (
  args: string | FetchArgs,
  headers: Record<string, string>
): FetchArgs =>
  typeof args === "string"
    ? { url: args, headers }
    : { ...args, headers: { ...args.headers, ...headers } };

type RefreshTokenQueryReturnValue = QueryReturnValue<
  RefreshTokenResponse,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

const apiQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    const isApiUrl =
      typeof args === "string"
        ? args.startsWith(API_BASE)
        : args.url.startsWith(API_BASE);

    if (isApiUrl) {
      const accessToken = localStorage.getItem(LS_ACCESS_TOKEN);

      if (accessToken) {
        const accessTokenJwt = jwtDecode<Jwt>(accessToken);

        const isAccessTokenExpired = accessTokenJwt.exp * 1000 < Date.now();

        if (isAccessTokenExpired) {
          const refreshTokenResponse = (await baseQuery(
            getRefreshTokenQuery(),
            api,
            extraOptions
          )) as RefreshTokenQueryReturnValue;

          if (refreshTokenResponse.data) {
            const { accessToken, refreshToken } = refreshTokenResponse.data;

            storeTokens(accessToken, refreshToken);
          }
        }
      }

      const newArgs = addHeadersToFetchArgs(args, getApiHeaders());
      let result = await baseQuery(newArgs, api, extraOptions);

      if (accessToken && result.error?.status === 401) {
        const refreshTokenResponse = (await baseQuery(
          getRefreshTokenQuery(),
          api,
          extraOptions
        )) as RefreshTokenQueryReturnValue;

        if (refreshTokenResponse.data) {
          const { accessToken, refreshToken } = refreshTokenResponse.data;

          storeTokens(accessToken, refreshToken);

          const newArgs = addHeadersToFetchArgs(args, getApiHeaders());

          result = await baseQuery(newArgs, api, extraOptions);
        }
      }

      return result;
    }

    const isApiPostgrestUrl =
      typeof args === "string"
        ? args.startsWith(API_BASE_POSTGREST)
        : args.url.startsWith(API_BASE_POSTGREST);

    if (isApiPostgrestUrl) {
      const newArgs = addHeadersToFetchArgs(args, SUPABASE_HEADERS);

      return baseQuery(newArgs, api, extraOptions);
    }

    return baseQuery(args, api, extraOptions);
  };

export default apiQuery;
