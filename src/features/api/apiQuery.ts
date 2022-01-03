import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import jwtDecode from 'jwt-decode';
import { AppState } from 'app/store';
import storeTokens from 'features/auth/storeTokens';
import { updateTokens } from 'features/auth/authSlice';
import { API_BASE, API_BASE_POSTGREST, SUPABASE_HEADERS } from './apiConstants';
import { Jwt, RefreshTokenResponse } from './apiTypes';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

const getApiHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const getRefreshTokenQuery = (refreshToken: string) => ({
  url: `${API_BASE}/auth/refresh-token`,
  method: 'POST',
  body: { refreshToken },
});

const addHeadersToFetchArgs = (
  args: string | FetchArgs,
  headers: Record<string, string>,
): FetchArgs =>
  typeof args === 'string'
    ? { url: args, headers }
    : { ...args, headers: { ...args.headers, ...headers } };

type RefreshTokenQueryReturnValue = QueryReturnValue<
  RefreshTokenResponse,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

// TODO: multiple requests in parallel are trying to refresh token
const apiQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isApiUrl =
    typeof args === 'string'
      ? args.startsWith(API_BASE)
      : args.url.startsWith(API_BASE);

  if (isApiUrl) {
    const state = api.getState() as AppState;

    let { accessToken, refreshToken } = state.auth;

    if (accessToken) {
      const accessTokenJwt = jwtDecode<Jwt>(accessToken);

      const isAccessTokenExpired = accessTokenJwt.exp * 1000 < Date.now();

      if (isAccessTokenExpired && refreshToken) {
        const refreshTokenResponse = (await baseQuery(
          getRefreshTokenQuery(refreshToken),
          api,
          extraOptions,
        )) as RefreshTokenQueryReturnValue;

        if (refreshTokenResponse.data) {
          accessToken = refreshTokenResponse.data.accessToken;
          refreshToken = refreshTokenResponse.data.refreshToken;

          api.dispatch(updateTokens({ accessToken, refreshToken }));
          storeTokens(accessToken, refreshToken);
        }
      }
    }

    if (!accessToken) throw new Error('No access token');

    const newArgs = addHeadersToFetchArgs(args, getApiHeaders(accessToken));
    let result = await baseQuery(newArgs, api, extraOptions);

    if (accessToken && refreshToken && result.error?.status === 401) {
      const refreshTokenResponse = (await baseQuery(
        getRefreshTokenQuery(refreshToken),
        api,
        extraOptions,
      )) as RefreshTokenQueryReturnValue;

      if (refreshTokenResponse.data) {
        accessToken = refreshTokenResponse.data.accessToken;
        refreshToken = refreshTokenResponse.data.refreshToken;

        api.dispatch(updateTokens({ accessToken, refreshToken }));
        storeTokens(accessToken, refreshToken);

        const newArgs2 = addHeadersToFetchArgs(
          args,
          getApiHeaders(accessToken),
        );

        result = await baseQuery(newArgs2, api, extraOptions);
      }
    }

    return result;
  }

  const isApiPostgrestUrl =
    typeof args === 'string'
      ? args.startsWith(API_BASE_POSTGREST)
      : args.url.startsWith(API_BASE_POSTGREST);

  if (isApiPostgrestUrl) {
    const newArgs = addHeadersToFetchArgs(args, SUPABASE_HEADERS);

    return baseQuery(newArgs, api, extraOptions);
  }

  return baseQuery(args, api, extraOptions);
};

export default apiQuery;
