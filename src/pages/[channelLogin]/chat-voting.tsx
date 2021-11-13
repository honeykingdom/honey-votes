import useChannelLogin from "hooks/useChannelLogin";
import Layout from "components/Layout";
import PageHeader from "components/PageHeader";
import { useUserQuery } from "features/api/apiSlice";
import ChatVotingComponent from "features/chat-voting/components/ChatVotingComponent";
import SignInWarning from "features/chat-voting/components/SignInWarning";

const ChatVotesPage = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login }, { skip: !login });

  const username = channel.data?.displayName || login;

  return (
    <Layout>
      <PageHeader
        title={
          username ? `${username} - Голосование в чате` : "Голосование в чате"
        }
        pageTitle="Голосование в чате"
        breadcrumbs={[
          { title: username, href: `/${login}` },
          { title: "Голосование в чате" },
        ]}
      />

      <ChatVotingComponent />
      {channel.isSuccess && !channel.data && <SignInWarning />}
    </Layout>
  );
};

export default ChatVotesPage;
