import Head from "next/head";
import { Typography, Box, Divider } from "@mui/material";
import Layout from "components/Layout";
import Breadcrumbs from "components/Breadcrumbs";
import { useUserQuery } from "features/api/apiSlice";
import ChatVotingComponent from "features/chat-voting/components/ChatVotingComponent";
import SignInWarning from "features/chat-voting/components/SignInWarning";
import useChannelLogin from "hooks/useChannelLogin";

const ChatVotesPage = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login }, { skip: !login });

  const username = channel.data?.displayName || login;

  return (
    <Layout>
      <Head>
        <title>
          {username
            ? `${username} - Голосование в чате | HoneyVotes`
            : "Голосование в чате | HoneyVotes"}
        </title>
      </Head>

      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        Голосование в чате
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          items={[
            { title: username, href: `/${login}` },
            { title: "Голосование в чате" },
          ]}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <ChatVotingComponent />
      {channel.isSuccess && !channel.data && <SignInWarning />}
    </Layout>
  );
};

export default ChatVotesPage;
