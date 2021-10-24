import Layout from "components/Layout";
// import UserCard from "components/UserCard";
import { useUserQuery } from "features/api/apiSlice";
import useChannelLogin from "hooks/useChannelLogin";

const ChannelPage = () => {
  const login = useChannelLogin();

  const channel = useUserQuery({ login }, { skip: !login });

  return (
    <Layout>
      {/* <pre>{JSON.stringify(channel, null, 2)}</pre> */}
      {/* <UserCard login={login} /> */}
    </Layout>
  );
};

export default ChannelPage;
