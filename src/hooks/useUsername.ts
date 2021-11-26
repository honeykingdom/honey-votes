import { useUserQuery } from 'features/api/apiSlice';
import useChannelLogin from './useChannelLogin';

const useUsername = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login: login! }, { skip: !login });

  return channel.data?.displayName || login || '';
};

export default useUsername;
