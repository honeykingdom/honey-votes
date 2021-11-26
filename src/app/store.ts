import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import auth from 'features/auth/authSlice';
import { api } from 'features/api/apiSlice';
import { igdbApi } from 'features/igdb-api/igdbApiSlice';
import { kinopoiskApi } from 'features/kinopoisk-api/kinopoiskApiSlice';
import { twitchApi } from 'features/twitch-api/twitchApiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth,
      [api.reducerPath]: api.reducer,
      [igdbApi.reducerPath]: igdbApi.reducer,
      [kinopoiskApi.reducerPath]: kinopoiskApi.reducer,
      [twitchApi.reducerPath]: twitchApi.reducer,
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      api.middleware,
      igdbApi.middleware,
      kinopoiskApi.middleware,
      twitchApi.middleware,
    ],
  });
};

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
