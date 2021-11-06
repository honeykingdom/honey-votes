import React, { useState } from "react";
import Head from "next/head";
import { Box } from "@mui/system";
import { Button, Divider, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "components/Layout";
import Breadcrumbs from "components/Breadcrumbs";
import TwitchBadge from "components/TwitchBadge";
import VotingOptionCard from "features/voting/components/VotingOptionCard";
import VotingOptionFormModal from "features/voting/components/VotingOptionFormModal/VotingOptionFormModal";
import VotingActions from "features/voting/components/VotingActions";
import LockIcon from "@mui/icons-material/Lock";
import {
  useCreateVotingOptionMutation,
  useMeQuery,
  useMeRolesQuery,
  useUserQuery,
  useVotingOptionsQuery,
  useVotingQuery,
  votingOptionsSelectors,
} from "features/api/apiSlice";
import useChannelLogin from "hooks/useChannelLogin";
import UserBadges from "features/voting/components/UserBadges";
import useVotingId from "features/voting/hooks/useVotingId";
import getCanManageVoting from "features/voting/utils/getCanManageVoting";
import getCanCreateVotingOptions from "features/voting/utils/getCanCreateVotingOptions";

const NO_TITLE = <em style={{ fontWeight: 300 }}>Без названия</em>;

const CLOSED = (
  <Typography
    component="span"
    color="text.secondary"
    display="flex"
    alignItems="center"
    sx={{ mr: 1 }}
  >
    <LockIcon />
  </Typography>
);

const VotingPage = () => {
  const login = useChannelLogin();
  const votingId = useVotingId();

  const channel = useUserQuery({ login }, { skip: !login });
  const voting = useVotingQuery(votingId, { skip: !votingId });
  const votingOptions = useVotingOptionsQuery(votingId, { skip: !votingId });
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login }, { skip: !login });

  const [createVotingOption] = useCreateVotingOptionMutation();

  const [isVotingOptionModalOpened, setIsVotingOptionModalOpened] =
    useState(false);

  const username = channel.data?.displayName || login;

  // TODO: handle not existing voting
  if (voting.isSuccess && !voting.data) {
    return null;
  }

  const canManageVoting = getCanManageVoting(
    voting.data,
    me.data,
    meRoles.data
  );

  const canManageVotingOptions = getCanCreateVotingOptions(
    voting.data,
    me.data,
    meRoles.data
  );

  const renderedVotingOptions = votingOptions.data
    ? votingOptionsSelectors.selectAll(votingOptions.data)
    : [];

  const getTitle = () => {
    if (!voting.data) return "Голосование";

    return voting.data?.title || NO_TITLE;
  };

  return (
    <Layout>
      <Head>
        <title>
          {username
            ? `${username} - ${
                voting.data?.title || "Без названия"
              } | HoneyVotes`
            : "Голосование | HoneyVotes"}
        </title>
      </Head>

      <Typography variant="h4" component="div" sx={{ display: "flex", mb: 2 }}>
        {!voting.data?.canManageVotes && CLOSED}
        {getTitle()}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          items={[
            {
              title: channel.data?.displayName || login,
              href: `/${login}`,
            },
            {
              title: "Голосование",
              href: `/${login}/voting`,
            },
            { title: voting.data?.title || NO_TITLE },
          ]}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {channel.data && voting.data && (
        <>
          {voting.data.description && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {voting.data.description}
            </Typography>
          )}

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                Голосовать могут:
              </Typography>
              <Typography variant="caption">
                <UserBadges
                  permissions={voting.data.permissions}
                  mode="canVote"
                />
              </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                Добавлять варианты могут:
              </Typography>
              <Typography variant="caption">
                <TwitchBadge name="broadcaster">Стример</TwitchBadge>{" "}
                <TwitchBadge name="moderator">Редакторы</TwitchBadge>{" "}
                <UserBadges
                  permissions={voting.data.permissions}
                  mode="canAddOptions"
                />
              </Typography>
            </Box>
          </Box>

          {canManageVoting && (
            <Box sx={{ mb: 2 }}>
              <VotingActions voting={voting.data} />
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {canManageVotingOptions && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsVotingOptionModalOpened(true)}
              >
                Добавить вариант
              </Button>
            </Box>
          )}
        </>
      )}

      {votingOptions.data && (
        <Grid container flexDirection="column">
          {renderedVotingOptions.map((votingOption) => (
            <Grid item sx={{ mb: 2 }} key={votingOption.id}>
              <VotingOptionCard
                key={votingOption.id}
                votingOption={votingOption}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <VotingOptionFormModal
        open={isVotingOptionModalOpened}
        title="Создать новый вариант для голосования"
        cancelButtonText="Отмена"
        submitButtonText="Создать"
        // @ts-expect-error
        allowedVotingOptionTypes={voting.data?.allowedVotingOptionTypes || []}
        onClose={() => setIsVotingOptionModalOpened(false)}
        onSubmit={async (body) => {
          await createVotingOption({ votingId, ...body });
          setIsVotingOptionModalOpened(false);
        }}
      />
    </Layout>
  );
};

export default VotingPage;
