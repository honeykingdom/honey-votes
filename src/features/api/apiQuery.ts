import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { COOKIE_ACCESS_TOKEN } from "utils/constants";
import { API_BASE, API_BASE_POSTGREST } from "./constants";
import { Jwt, RefreshTokenResponse } from "./types";

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const baseQuery = fetchBaseQuery({ baseUrl: "" });

const getApiHeaders = () => ({
  Authorization: `Bearer ${Cookies.get(COOKIE_ACCESS_TOKEN)}`,
});

const getRefreshTokenQuery = () => ({
  url: `${API_BASE}/auth/refresh-token`,
  method: "POST",
  body: { refreshToken: Cookies.get("refreshToken") },
});

const storeTokens = ({ accessToken, refreshToken }) => {
  Cookies.set("accessToken", accessToken);
  Cookies.set("refreshToken", refreshToken);
};

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
      const accessTokenJwt = jwtDecode<Jwt>(Cookies.get("accessToken"));
      const isAccessTokenExpired = accessTokenJwt.exp * 1000 < Date.now();

      if (isAccessTokenExpired) {
        const refreshTokenResponse = (await baseQuery(
          getRefreshTokenQuery(),
          api,
          extraOptions
        )) as RefreshTokenQueryReturnValue;

        if (refreshTokenResponse.data) storeTokens(refreshTokenResponse.data);
      }

      const newArgs = addHeadersToFetchArgs(args, getApiHeaders());
      let result = await baseQuery(newArgs, api, extraOptions);

      if (result.error?.status === 401) {
        const refreshTokenResponse = (await baseQuery(
          getRefreshTokenQuery(),
          api,
          extraOptions
        )) as RefreshTokenQueryReturnValue;

        if (refreshTokenResponse.data) {
          storeTokens(refreshTokenResponse.data);

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
