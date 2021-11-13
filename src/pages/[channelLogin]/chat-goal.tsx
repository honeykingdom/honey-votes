import Layout from "components/Layout";
import PageHeader from "components/PageHeader";
import useChannelLogin from "hooks/useChannelLogin";
import { useUserQuery } from "features/api/apiSlice";
import ChatGoalComponent from "features/chat-goal/components/ChatGoalComponent";

const ChatGoalPage = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login }, { skip: !login });

  const username = channel.data?.displayName || login;

  return (
    <Layout>
      <PageHeader
        title={username ? `${username} - Чатгол` : "Чатгол"}
        pageTitle="Чатгол"
        breadcrumbs={[
          { title: username, href: `/${login}` },
          { title: "Чатгол" },
        ]}
      />

      <ChatGoalComponent />
    </Layout>
  );
};

export default ChatGoalPage;
