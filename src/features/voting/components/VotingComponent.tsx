import React, { useRef, useState } from "react";
import { Alert, Box, Button, Divider, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { useAppSelector } from "app/hooks";
import TwitchBadge from "components/TwitchBadge";
import useChannelLogin from "hooks/useChannelLogin";
import VotingOptionCard from "features/voting/components/VotingOptionCard";
import VotingOptionFormModal from "features/voting/components/VotingOptionFormModal/VotingOptionFormModal";
import type { VotingOptionDefaultValues } from "features/voting/components/VotingOptionFormModal/VotingOptionFormModal";
import VotingActions from "features/voting/components/VotingActions";
import {
  useCreateVotingOptionMutation,
  useMeQuery,
  useMeRolesQuery,
  useUserQuery,
  useVotesQuery,
  useVotingOptionsQuery,
  useVotingQuery,
} from "features/api/apiSlice";
import { renderedVotingOptionsSelector } from "features/api/apiSelectors";
import apiSchema from "features/api/apiSchema.json";
import UserBadges from "features/voting/components/UserBadges";
import useVotingId from "features/voting/hooks/useVotingId";
import getCanManageVoting from "features/voting/utils/getCanManageVoting";
import getCanCreateVotingOptions from "features/voting/utils/getCanCreateVotingOptions";
import getVotingPermissionsBadges from "features/voting/utils/getVotingPermissionsBadges";
import getMeBadges from "features/voting/utils/getMeBadges";
import getCanVote from "features/voting/utils/getCanVote";
import useSnackbar from "features/snackbar/useSnackbar";

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

const VotingComponent = () => {
  const login = useChannelLogin();
  const votingId = useVotingId();
  const snackbar = useSnackbar();

  const channel = useUserQuery({ login }, { skip: !login });
  const voting = useVotingQuery(votingId, { skip: !votingId });
  const votingOptions = useVotingOptionsQuery(votingId, { skip: !votingId });
  const votes = useVotesQuery(votingId, { skip: !votingId });
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login }, { skip: !login });

  const [createVotingOption] = useCreateVotingOptionMutation();

  const lastVoteTimestampRef = useRef(0);
  const [isVotingOptionModalOpened, setIsVotingOptionModalOpened] =
    useState(false);

  const renderedVotingOptions = useAppSelector((state) =>
    renderedVotingOptionsSelector(state, votingId)
  );

  // TODO: handle not existing voting
  if (voting.isSuccess && !voting.data) {
    return null;
  }

  const canManageVoting = getCanManageVoting(
    voting.data,
    me.data,
    meRoles.data
  );

  const [canCreateVotingOptions, canCreateVotingOptionsReason] =
    getCanCreateVotingOptions(
      voting.data,
      renderedVotingOptions,
      me.data,
      meRoles.data
    );

  const canVote = getCanVote(voting.data, me.data, meRoles.data);

  const handleCreateVotingOption = async (body: VotingOptionDefaultValues) => {
    const result = await createVotingOption({ votingId, ...body });

    // @ts-expect-error
    if (result.error) {
      snackbar({
        message: "Не удалось добавить вариант",
        variant: "error",
      });
    } else {
      snackbar({
        message: "Вариант добавлен",
        variant: "success",
      });
    }

    setIsVotingOptionModalOpened(false);
  };

  const renderPermissions = () => (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 1, sm: 0 },
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
          Голосовать могут:
        </Typography>
        <Typography variant="caption">
          <UserBadges
            badges={getVotingPermissionsBadges(
              voting.data.permissions,
              "canVote"
            )}
            channelId={channel.data.id}
          />
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 1, sm: 0 },
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
          Добавлять варианты могут:
        </Typography>
        <Typography variant="caption">
          <TwitchBadge name="broadcaster">Стример</TwitchBadge>{" "}
          <TwitchBadge name="moderator">Редакторы</TwitchBadge>{" "}
          <UserBadges
            badges={getVotingPermissionsBadges(
              voting.data.permissions,
              "canAddOptions"
            )}
            channelId={channel.data.id}
          />
        </Typography>
      </Box>
    </>
  );

  return (
    <>
      {channel.data && voting.data && (
        <>
          {voting.data.description && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {voting.data.description}
            </Typography>
          )}

          <Box sx={{ mb: 2 }}>
            {canManageVoting && renderPermissions()}

            {me.data &&
              meRoles.data &&
              voting.data?.canManageVotes &&
              !canVote && (
                <Box mt={1}>
                  <Alert severity="warning">
                    Вы не можете участвовать в этом голосовании. <br />
                    Голосовать могут:{" "}
                    <UserBadges
                      badges={getVotingPermissionsBadges(
                        voting.data.permissions,
                        "canVote"
                      )}
                      channelId={channel.data.id}
                    />
                    <br />
                    Вы:{" "}
                    <UserBadges
                      badges={getMeBadges(me.data, meRoles.data)}
                      channelId={channel.data.id}
                    />
                  </Alert>
                </Box>
              )}
            {!voting.data?.canManageVotes && (
              <Box mt={1}>
                <Alert severity="error">Голосование закрыто.</Alert>
              </Box>
            )}
          </Box>

          {canManageVoting && (
            <Box sx={{ mb: 2 }}>
              <VotingActions voting={voting.data} />
            </Box>
          )}

          <Typography component="div" variant="h5" sx={{ mb: 1 }}>
            Вариантов: {renderedVotingOptions.length}/
            {voting.data?.votingOptionsLimit ||
              apiSchema.Voting.votingOptionsLimit.default}
            , голосов: {votes.data?.ids.length || 0}{" "}
          </Typography>

          <Divider sx={{ mb: 1 }} />

          {canCreateVotingOptions && (
            <Box sx={{ mb: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsVotingOptionModalOpened(true)}
              >
                Добавить вариант
              </Button>
            </Box>
          )}

          {!canCreateVotingOptions && canCreateVotingOptionsReason && (
            <Alert severity="info" sx={{ mb: 1 }}>
              {canCreateVotingOptionsReason} <br />
            </Alert>
          )}
        </>
      )}
      {votingOptions.data && renderedVotingOptions.length > 0 && (
        <Grid container flexDirection="column">
          {renderedVotingOptions.map(
            ({ votingOption, isActive, fullVotesValue }) => (
              <Grid item sx={{ mb: 2 }} key={votingOption.id}>
                <VotingOptionCard
                  key={votingOption.id}
                  votingOption={votingOption}
                  isActive={isActive}
                  fullVotesValue={fullVotesValue}
                  lastVoteTimestampRef={lastVoteTimestampRef}
                />
              </Grid>
            )
          )}
        </Grid>
      )}
      {votingOptions.data && renderedVotingOptions.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          В этом голосовании пока нет ни одного варианта
        </Typography>
      )}
      <VotingOptionFormModal
        open={isVotingOptionModalOpened}
        title="Создать новый вариант для голосования"
        cancelButtonText="Отмена"
        submitButtonText="Создать"
        // @ts-expect-error
        allowedVotingOptionTypes={voting.data?.allowedVotingOptionTypes || []}
        onClose={() => setIsVotingOptionModalOpened(false)}
        onSubmit={handleCreateVotingOption}
      />
    </>
  );
};

export default VotingComponent;
