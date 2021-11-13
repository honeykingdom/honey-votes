import NextLink from "next/link";
import { Box, Button } from "@mui/material";
import Layout from "components/Layout";
import PageHeader from "components/PageHeader";
import useChannelLogin from "hooks/useChannelLogin";
import useUsername from "hooks/useUsername";
import { useMeQuery, useUserQuery } from "features/api/apiSlice";
import getMainMenuLinks from "utils/getMainMenuLinks";

const ChannelPage = () => {
  const login = useChannelLogin();
  const username = useUsername();

  const me = useMeQuery();

  return (
    <Layout>
      <PageHeader
        title={username}
        pageTitle={username}
        breadcrumbs={[{ title: username }]}
      />

      {me.data && (
        <>
          {getMainMenuLinks(login).map(({ href, label, IconComponent }) => (
            <Box key={href}>
              <NextLink href={href} passHref>
                <Button startIcon={<IconComponent />}>{label}</Button>
              </NextLink>
            </Box>
          ))}
        </>
      )}
    </Layout>
  );
};

export default ChannelPage;
