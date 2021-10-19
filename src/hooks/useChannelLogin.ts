import { useRouter } from "next/router";

const useChannelLogin = () => {
  const router = useRouter();

  return (router.query.channelLogin as string | undefined)?.toLowerCase();
};

export default useChannelLogin;
