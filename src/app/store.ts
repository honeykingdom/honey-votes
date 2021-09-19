import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import { api } from "features/api/apiSlice";
import votes from "features/votes/votesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      votes,
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      api.middleware,
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
