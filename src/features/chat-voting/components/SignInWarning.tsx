import { Alert, AlertTitle, Link } from '@mui/material';
import { useMeQuery } from 'features/api/apiSlice';
import useChannelLogin from 'hooks/useChannelLogin';
import { AUTH_URL, LS_REDIRECT_PATH } from 'features/auth/authConstants';

const SignInWarning = () => {
  const login = useChannelLogin();
  const me = useMeQuery();

  const handleSignIn = () => {
    localStorage.setItem(LS_REDIRECT_PATH, window.location.pathname);
  };

  return (
    <Alert severity="warning">
      <AlertTitle>
        Голосование для канала <strong>{login}</strong> ещё не создано.
      </AlertTitle>
      Если вы владелец канала <strong>twitch.tv/{login}</strong>, пожалуйста,{' '}
      {me.isSuccess ? (
        'войдите'
      ) : (
        <Link href={AUTH_URL} onClick={handleSignIn}>
          войдите
        </Link>
      )}
      , чтобы создать голосование.
    </Alert>
  );
};

export default SignInWarning;
