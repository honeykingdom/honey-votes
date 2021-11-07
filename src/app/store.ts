import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import auth from "features/auth/authSlice";
import snackbar from "features/snackbar/snackbarSlice";
import { api } from "features/api/apiSlice";
import { kinopoiskApi } from "features/kinopoisk-api/kinopoiskApiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth,
      snackbar,
      [api.reducerPath]: api.reducer,
      [kinopoiskApi.reducerPath]: kinopoiskApi.reducer,
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
