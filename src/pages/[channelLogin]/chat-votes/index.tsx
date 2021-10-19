import Head from "next/head";
import { Typography, Box, Divider } from "@mui/material";
import Layout from "components/Layout";
import Breadcrumbs from "components/Breadcrumbs";
import { useUserQuery } from "features/api/apiSlice";
import ChatVotingComponent from "features/chat-votes/components/ChatVotingComponent";
import SignInWarning from "features/chat-votes/components/SignInWarning";
import useChannelLogin from "hooks/useChannelLogin";

const ChatVotesPage = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login }, { skip: !login });

  return (
    <Layout>
      <Head>
        {/* TODO: " - Голосование в чате" */}
        <title>{channel.data?.displayName || login} - Голосование в чате</title>
      </Head>

      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        Голосование в чате
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          items={[
            {
              title: channel.data?.displayName || login,
              // href: `/${channel.data?.login || login}`,
            },
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
