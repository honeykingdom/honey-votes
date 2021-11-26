import Layout from 'components/Layout';
import PageHeader from 'components/PageHeader';
import TwitchUsername from 'components/TwitchUsername';
import useUsername from 'hooks/useUsername';
import useChannelLogin from 'hooks/useChannelLogin';
import ChatVotingComponent from 'features/chat-voting/components/ChatVotingComponent';
import SignInWarning from 'features/chat-voting/components/SignInWarning';
import { useUserQuery } from 'features/api/apiSlice';

const ChatVotesPage = () => {
  const login = useChannelLogin();
  const username = useUsername();

  const channel = useUserQuery({ login: login! }, { skip: !login });

  return (
    <Layout>
      <PageHeader
        title={
          username ? `${username} - Голосование в чате` : 'Голосование в чате'
        }
        pageTitle="Голосование в чате"
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
          { title: 'Голосование в чате' },
        ]}
      />

      <ChatVotingComponent />
      {channel.isSuccess && !channel.data && <SignInWarning />}
    </Layout>
  );
};

export default ChatVotesPage;
