import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';
import { Box, Button } from '@mui/material';
import Layout from 'components/Layout';
import PageHeader from 'components/PageHeader';
import useChannelLogin from 'hooks/useChannelLogin';
import useUsername from 'hooks/useUsername';
import { useUserQuery } from 'features/api/apiSlice';
import getMainMenuLinks from 'utils/getMainMenuLinks';
import TwitchUsername from 'components/TwitchUsername';

const ChannelPage = () => {
  const [t] = useTranslation(['common', 'voting', 'chatVoting', 'chatGoal']);
  const login = useChannelLogin();
  const channel = useUserQuery({ login: login! }, { skip: !login });
  const username = useUsername();

  return (
    <Layout>
      <PageHeader
        title={username}
        pageTitle={username}
        breadcrumbs={[
          {
            title: (
              <TwitchUsername
                username={username}
                avatarUrl={channel.data?.avatarUrl}
              />
            ),
          },
        ]}
      />

      {channel.data && (
        <>
          {getMainMenuLinks(channel.data).map(
            ({ name, href, IconComponent }) => (
              <Box key={href}>
                <NextLink href={href} passHref>
                  <Button startIcon={<IconComponent />}>
                    {t('title', { ns: name })}
                  </Button>
                </NextLink>
              </Box>
            ),
          )}
        </>
      )}
    </Layout>
  );
};

export default ChannelPage;
