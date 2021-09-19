import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import api from "features/api/apiSlice";
import votes from "features/votes/votesSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      api,
      votes,
    },
  });
}

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
