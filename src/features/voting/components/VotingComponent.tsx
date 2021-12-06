import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from 'app/hooks';
import useChannelLogin from 'hooks/useChannelLogin';
import VotingOptionCard from 'features/voting/components/VotingOptionCard';
import VotingOptionFormModal from 'features/voting/components/VotingOptionFormModal/VotingOptionFormModal';
import type { VotingOptionDefaultValues } from 'features/voting/components/VotingOptionFormModal/VotingOptionFormModal';
import VotingActions from 'features/voting/components/VotingActions';
import {
  useCreateVotingOptionMutation,
  useMeQuery,
  useMeRolesQuery,
  useUpdateVotingMutation,
  useUserQuery,
  useVotesQuery,
  useVotingOptionsQuery,
  useVotingQuery,
} from 'features/api/apiSlice';
import { renderedVotingOptionsSelector } from 'features/api/apiSelectors';
import apiSchema from 'features/api/apiSchema.json';
import getErrorMessageKey from 'features/api/utils/getErrorMessageKey';
import UserBadges from 'features/voting/components/UserBadges';
import useVotingId from 'features/voting/hooks/useVotingId';
import getCanManageVoting from 'features/voting/utils/getCanManageVoting';
import getCanCreateVotingOptions from 'features/voting/utils/getCanCreateVotingOptions';
import getVotingPermissionsBadges from 'features/voting/utils/getVotingPermissionsBadges';
import getMeBadges from 'features/voting/utils/getMeBadges';
import getCanVote from 'features/voting/utils/getCanVote';

const VotingComponent = () => {
  const [t] = useTranslation(['voting', 'common']);
  const login = useChannelLogin();
  const votingId = useVotingId();
  const { enqueueSnackbar } = useSnackbar();

  const channel = useUserQuery({ login: login! }, { skip: !login });
  const voting = useVotingQuery(votingId!, { skip: !votingId });
  const votingOptions = useVotingOptionsQuery(votingId!, {
    skip: !votingId,
    pollingInterval: 60 * 1000, // 1 min
  });
  const votes = useVotesQuery(votingId!, {
    skip: !votingId,
    pollingInterval: 60 * 1000, // 1 min
  });
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login: login! }, { skip: !login });

  const [updateVoting, updateVotingResult] = useUpdateVotingMutation();
  const [createVotingOption] = useCreateVotingOptionMutation();

  const lastVoteTimestampRef = useRef(0);
  const [isVotingOptionModalOpened, setIsVotingOptionModalOpened] =
    useState(false);

  const renderedVotingOptions = useAppSelector((state) =>
    renderedVotingOptionsSelector(state, votingId!),
  );

  if (!voting.data) return null;

  const canManageVoting = getCanManageVoting(
    voting.data,
    me.data,
    meRoles.data,
  );

  const [canCreateVotingOptions, canCreateVotingOptionsReason] =
    getCanCreateVotingOptions(
      voting.data,
      renderedVotingOptions,
      me.data,
      meRoles.data,
    );

  const canVote = getCanVote(voting.data, me.data, meRoles.data);

  const updateVotingAndNotify = async (
    arg: Parameters<typeof updateVoting>[0],
  ) => {
    try {
      await updateVoting(arg).unwrap();

      enqueueSnackbar(t('message.votingUpdateSuccess'), {
        variant: 'success',
      });
    } catch (e) {
      enqueueSnackbar(
        t([`message.${getErrorMessageKey(e)}`, 'message.votingUpdateFailure']),
        { variant: 'error' },
      );
    }
  };

  const handleToggleCanManageVotes = () =>
    updateVotingAndNotify({
      votingId: votingId!,
      body: { canManageVotes: !voting.data?.canManageVotes },
    });

  const handleToggleCanManageVotingOptions = () =>
    updateVotingAndNotify({
      votingId: votingId!,
      body: { canManageVotingOptions: !voting.data?.canManageVotingOptions },
    });

  const handleToggleShowValues = () =>
    updateVotingAndNotify({
      votingId: votingId!,
      body: { showValues: !voting.data?.showValues },
    });

  const handleCreateVotingOption = async (body: VotingOptionDefaultValues) => {
    try {
      await createVotingOption({ votingId: votingId!, ...body }).unwrap();

      enqueueSnackbar(t('message.votingOptionCreateSuccess'), {
        variant: 'success',
      });

      setIsVotingOptionModalOpened(false);
    } catch (e) {
      enqueueSnackbar(
        t([
          `message.${getErrorMessageKey(e)}`,
          'message.votingOptionCreateFailure',
        ]),
        { variant: 'error' },
      );
    }
  };

  const renderAdminTable = () => (
    <Box mb={2}>
      <TableContainer sx={{ mb: 1, color: 'text.secondary' }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'inherit', width: { sm: 270 } }}>
                {t('votingForm.canManageVotes')}
              </TableCell>
              <TableCell>
                <Switch
                  size="small"
                  checked={voting.data?.canManageVotes}
                  disabled={updateVotingResult.isLoading}
                  onClick={handleToggleCanManageVotes}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ color: 'inherit' }}>
                {t('votingForm.canManageVotingOptions')}
              </TableCell>
              <TableCell>
                <Switch
                  size="small"
                  checked={voting.data?.canManageVotingOptions}
                  disabled={updateVotingResult.isLoading}
                  onClick={handleToggleCanManageVotingOptions}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ color: 'inherit' }}>
                {t('votingForm.whoCanVote')}
              </TableCell>
              <TableCell sx={{ color: 'inherit' }}>
                <UserBadges
                  badges={getVotingPermissionsBadges(
                    voting.data!.permissions,
                    'canVote',
                    t,
                  )}
                  channelId={channel.data?.id}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ color: 'inherit' }}>
                {t('votingForm.whoCanAddOptions')}
              </TableCell>
              <TableCell sx={{ color: 'inherit' }}>
                <UserBadges
                  badges={getVotingPermissionsBadges(
                    voting.data!.permissions,
                    'canAddOptions',
                    t,
                  )}
                  channelId={channel.data?.id}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ color: 'inherit' }}>
                {t('votingForm.showValues')}
              </TableCell>
              <TableCell>
                <Switch
                  size="small"
                  checked={voting.data?.showValues}
                  disabled={updateVotingResult.isLoading}
                  onClick={handleToggleShowValues}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <VotingActions voting={voting.data!} buttons={['edit', 'delete']} />
    </Box>
  );

  return (
    <>
      <Box sx={{ mb: 2 }}>
        {me.data && meRoles.data && voting.data?.canManageVotes && !canVote && (
          <Box mt={1}>
            <Alert severity="warning">
              {t('youCannotParticipateInThisVoting')} <br />
              {t('votingForm.whoCanVote')}:{' '}
              <UserBadges
                badges={getVotingPermissionsBadges(
                  voting.data.permissions,
                  'canVote',
                  t,
                )}
                channelId={channel.data?.id}
              />
              <br />
              {t('you', { ns: 'common' })}:{' '}
              <UserBadges
                badges={getMeBadges(me.data, meRoles.data, t)}
                channelId={channel.data?.id}
              />
            </Alert>
          </Box>
        )}
        {!voting.data?.canManageVotes && (
          <Box mt={1}>
            <Alert severity="error">{t('votingClosed')}</Alert>
          </Box>
        )}
      </Box>

      {voting.data.description && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {voting.data.description}
        </Typography>
      )}

      {canManageVoting && renderAdminTable()}

      <Typography
        component="div"
        variant="h5"
        sx={{ display: { sm: 'flex' }, mb: 1 }}
      >
        <Box>
          {t('options')}&nbsp;({renderedVotingOptions.length}/
          {voting.data?.votingOptionsLimit ||
            apiSchema.Voting.votingOptionsLimit.default}
          )
          <Tooltip title={canCreateVotingOptionsReason || ''}>
            <Box component="span">
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ ml: 2 }}
                disabled={!canCreateVotingOptions}
                onClick={() => setIsVotingOptionModalOpened(true)}
              >
                {t('add', { ns: 'common' })}
              </Button>
            </Box>
          </Tooltip>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          {t('votes')}:&nbsp;{votes.data?.ids.length || 0}
        </Box>
      </Typography>

      <Divider sx={{ mb: 2 }} />

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
            ),
          )}
        </Grid>
      )}
      {votingOptions.data && renderedVotingOptions.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          {t('noOptions')}
        </Typography>
      )}
      <VotingOptionFormModal
        open={isVotingOptionModalOpened}
        title={t('createOption')}
        cancelButtonText={t('cancel', { ns: 'common' })}
        submitButtonText={t('create', { ns: 'common' })}
        // @ts-expect-error
        allowedVotingOptionTypes={voting.data?.allowedVotingOptionTypes || []}
        onClose={() => setIsVotingOptionModalOpened(false)}
        onSubmit={handleCreateVotingOption}
      />
    </>
  );
};

export default VotingComponent;
