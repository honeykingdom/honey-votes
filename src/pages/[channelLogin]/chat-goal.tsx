import Layout from "components/Layout";
import PageHeader from "components/PageHeader";
import useChannelLogin from "hooks/useChannelLogin";
import useUsername from "hooks/useUsername";
import ChatGoalComponent from "features/chat-goal/components/ChatGoalComponent";

const ChatGoalPage = () => {
  const login = useChannelLogin();
  const username = useUsername();

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
