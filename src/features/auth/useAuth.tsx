import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'app/hooks';
import { useMeQuery } from 'features/api/apiSlice';
import { LS_REDIRECT_PATH } from 'features/auth/authConstants';
import { removeTokens, storeTokens } from 'features/auth/tokensStorage';
import { clearTokens, updateTokens } from 'features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const me = useMeQuery();

  useEffect(() => {
    if (!window.location.hash.startsWith('#accessToken=')) return;

    const [accessToken, refreshToken] = window.location.hash
      .slice(1)
      .split('&')
      .map((s) => s.split('=')[1]);

    dispatch(updateTokens({ accessToken, refreshToken }));
    storeTokens(accessToken, refreshToken);

    window.location.hash = '';

    const redirectPath = localStorage.getItem(LS_REDIRECT_PATH);

    if (redirectPath) {
      localStorage.removeItem(LS_REDIRECT_PATH);
      router.replace(redirectPath);
    }

    setTimeout(() => {
      me.refetch();
    }, 500);
  }, []);

  useEffect(() => {
    if (me.isSuccess && me.data?.areTokensValid === false) {
      dispatch(clearTokens());
      removeTokens();

      me.refetch();
    }
  }, [me.isSuccess, me.data]);
};
