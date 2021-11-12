import Head from "next/head";
import { Typography, Box, Divider } from "@mui/material";
import Layout from "components/Layout";
import Breadcrumbs from "components/Breadcrumbs";
import { useUserQuery } from "features/api/apiSlice";
import useChannelLogin from "hooks/useChannelLogin";
import ChatGoalComponent from "features/chat-goal/components/ChatGoalComponent";

const ChatGoalPage = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login }, { skip: !login });

  const username = channel.data?.displayName || login;

  return (
    <Layout>
      <Head>
        <title>
          {username
            ? `${username} - Чатгол | HoneyVotes`
            : "Чатгол | HoneyVotes"}
        </title>
      </Head>

      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        Чатгол
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          items={[{ title: username, href: `/${login}` }, { title: "Чатгол" }]}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <ChatGoalComponent />
    </Layout>
  );
};

export default ChatGoalPage;
