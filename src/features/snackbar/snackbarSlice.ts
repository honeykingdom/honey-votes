import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SnackbarState = {
  open: boolean;
  message: string;
  variant: AlertColor;
};

const initialState: SnackbarState = {
  open: false,
  message: "",
  variant: "info",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      { payload }: PayloadAction<Omit<SnackbarState, "open">>
    ) => {
      state.open = true;
      state.message = payload.message;
      state.variant = payload.variant;
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
