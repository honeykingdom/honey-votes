import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import { api } from "features/api/apiSlice";
import { kinopoiskApi } from "features/kinopoisk-api/kinopoiskApiSlice";
// import voting from "features/voting/votingSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [kinopoiskApi.reducerPath]: kinopoiskApi.reducer,
      // voting,
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      api.middleware,
      kinopoiskApi.middleware,
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
