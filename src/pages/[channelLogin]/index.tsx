import NextLink from "next/link";
import { Box, Divider, Link, Typography } from "@mui/material";
import Breadcrumbs from "components/Breadcrumbs";
import Layout from "components/Layout";
import { useMeQuery, useUserQuery } from "features/api/apiSlice";
import useChannelLogin from "hooks/useChannelLogin";

const ChannelPage = () => {
  const login = useChannelLogin();

  const me = useMeQuery();
  const channel = useUserQuery({ login }, { skip: !login });

  return (
    <Layout>
      <Box sx={{ mb: 2 }}>
        <Typography component="div" variant="h4">
          {channel.data?.displayName || login}
        </Typography>
      </Box>

      {channel.data && (
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs
            items={[{ title: channel.data?.displayName || login }]}
          />
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <NextLink href={`/${me.data.login}/voting`} passHref>
        <Link>Голосование</Link>
      </NextLink>

      <br />

      <NextLink href={`/${me.data.login}/chat-voting`} passHref>
        <Link>Голосование в чате</Link>
      </NextLink>
    </Layout>
  );
};

export default ChannelPage;
