import { Alert } from '@mui/material';
import Layout from 'components/Layout';
import PageHeader from 'components/PageHeader';
import TwitchUsername from 'components/TwitchUsername';
import useChannelLogin from 'hooks/useChannelLogin';
import useUsername from 'hooks/useUsername';
import { useUserQuery } from 'features/api/apiSlice';
import ChatGoalComponent from 'features/chat-goal/components/ChatGoalComponent';

const ChatGoalPage = () => {
  const login = useChannelLogin();
  const channel = useUserQuery({ login: login! }, { skip: !login });
  const username = useUsername();

  return (
    <Layout>
      <PageHeader
        title={username ? `${username} - Чатгол` : 'Чатгол'}
        pageTitle="Чатгол"
        breadcrumbs={[
          {
            title: (
              <TwitchUsername
                username={username}
                avatarUrl={channel.data?.avatarUrl}
              />
            ),
            href: `/${login}`,
          },
          { title: 'Чатгол' },
        ]}
      />

      {/* <ChatGoalComponent /> */}
      <Alert severity="error">Чатгол временно не работает!</Alert>
    </Layout>
  );
};

export default ChatGoalPage;
