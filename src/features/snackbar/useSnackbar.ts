import { useMemo } from "react";
import { useAppDispatch } from "app/hooks";
import { showSnackbar } from "./snackbarSlice";

const useSnackbar = () => {
  const dispatch = useAppDispatch();

  return useMemo(
    () => (payload: Parameters<typeof showSnackbar>[0]) => {
      dispatch(showSnackbar(payload));
    },
    []
  );
};

export default useSnackbar;
