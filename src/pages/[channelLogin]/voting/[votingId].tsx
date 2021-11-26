import React from 'react';
import Layout from 'components/Layout';
import PageHeader from 'components/PageHeader';
import TwitchUsername from 'components/TwitchUsername';
import useUsername from 'hooks/useUsername';
import useChannelLogin from 'hooks/useChannelLogin';
import { useUserQuery, useVotingQuery } from 'features/api/apiSlice';
import useVotingId from 'features/voting/hooks/useVotingId';
import VotingComponent from 'features/voting/components/VotingComponent';

const NO_TITLE = <em style={{ fontWeight: 300 }}>Без названия</em>;

const VotingPage = () => {
  const login = useChannelLogin();
  const username = useUsername();
  const votingId = useVotingId();

  const channel = useUserQuery({ login: login! }, { skip: !login });
  const voting = useVotingQuery(votingId!, { skip: !votingId });

  const isLoading =
    voting.isLoading ||
    channel.isLoading ||
    voting.isUninitialized ||
    channel.isUninitialized;
  const isVotingExists = voting.isSuccess && voting.data;
  const isVotingBelongsToChannel =
    voting.isSuccess &&
    channel.isSuccess &&
    voting.data?.broadcasterId === channel.data?.id;

  const isVotingVisible = isVotingExists && isVotingBelongsToChannel;

  const getTitle = () => {
    if (!voting.data || !isVotingVisible) return 'Голосование';

    return voting.data?.title || NO_TITLE;
  };

  const title =
    isVotingVisible && username
      ? `${username} - ${voting.data?.title || 'Без названия'}`
      : 'Голосование';

  const breadcrumbs: Parameters<typeof PageHeader>[0]['breadcrumbs'] = [
    {
      title: (
        <TwitchUsername
          username={username}
          avatarUrl={channel.data?.avatarUrl}
        />
      ),
      href: `/${login}`,
    },
    {
      title: 'Голосование',
      href: `/${login}/voting`,
    },
  ];

  if (isVotingVisible) {
    breadcrumbs.push({ title: voting.data?.title || NO_TITLE });
  }

  return (
    <Layout>
      <PageHeader
        title={title}
        pageTitle={getTitle()}
        breadcrumbs={breadcrumbs}
      />

      {!isLoading && isVotingVisible && <VotingComponent />}

      {!isLoading && !isVotingVisible && (
        <>Голосование удалено или не существует.</>
      )}
    </Layout>
  );
};

export default VotingPage;
