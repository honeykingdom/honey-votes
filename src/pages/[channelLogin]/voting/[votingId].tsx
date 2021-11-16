import React from "react";
import Layout from "components/Layout";
import PageHeader from "components/PageHeader";
import TwitchUsername from "components/TwitchUsername";
import useUsername from "hooks/useUsername";
import useChannelLogin from "hooks/useChannelLogin";
import { useUserQuery, useVotingQuery } from "features/api/apiSlice";
import useVotingId from "features/voting/hooks/useVotingId";
import VotingComponent from "features/voting/components/VotingComponent";

const NO_TITLE = <em style={{ fontWeight: 300 }}>Без названия</em>;

const VotingPage = () => {
  const login = useChannelLogin();
  const username = useUsername();
  const votingId = useVotingId();

  const channel = useUserQuery({ login }, { skip: !login });
  const voting = useVotingQuery(votingId, { skip: !votingId });

  const getTitle = () => {
    if (!voting.data) return "Голосование";

    return voting.data?.title || NO_TITLE;
  };

  return (
    <Layout>
      <PageHeader
        title={
          username
            ? `${username} - ${voting.data?.title || "Без названия"}`
            : "Голосование"
        }
        pageTitle={getTitle()}
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
          {
            title: "Голосование",
            href: `/${login}/voting`,
          },
          { title: voting.data?.title || NO_TITLE },
        ]}
      />

      <VotingComponent />
    </Layout>
  );
};

export default VotingPage;
