import * as R from 'ramda';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Box, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  useDeleteVotingMutation,
  useUpdateVotingMutation,
} from 'features/api/apiSlice';
import { Voting } from 'features/api/apiTypes';
import getErrorMessageKey from 'features/api/utils/getErrorMessageKey';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useChannelLogin from 'hooks/useChannelLogin';
import VotingFormModal from './VotingFormModal/VotingFormModal';

const getVotingFormValues = R.pick<keyof Voting>([
  'title',
  'description',
  'canManageVotes',
  'canManageVotingOptions',
  'permissions',
  'showValues',
  'allowedVotingOptionTypes',
  'votingOptionsLimit',
]);

type ButtonType = 'close' | 'edit' | 'delete';

type Props = {
  voting: Voting;
  buttons?: ButtonType[];
};

const VotingActions = ({
  voting,
  buttons = ['close', 'edit', 'delete'],
}: Props) => {
  const [t] = useTranslation(['voting', 'common']);
  const router = useRouter();
  const login = useChannelLogin();

  const { enqueueSnackbar } = useSnackbar();

  const [updateVoting, updateVotingResult] = useUpdateVotingMutation();
  const [deleteVoting, deleteVotingResult] = useDeleteVotingMutation();

  const [isVotingFormOpened, setIsVotingFormOpened] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { id: votingId, canManageVotes } = voting;

  const updateVotingAndNotify = async (
    data: Parameters<typeof updateVoting>[0],
  ) => {
    try {
      await updateVoting(data).unwrap();

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

  const handleToggleVoting = () =>
    updateVotingAndNotify({
      votingId,
      body: { canManageVotes: !canManageVotes },
    });

  const handleEditVoting = async (body: Partial<Voting>) => {
    await updateVotingAndNotify({ votingId, body });

    setIsVotingFormOpened(false);
  };

  const handleDeleteVoting = async () => {
    try {
      await deleteVoting(votingId).unwrap();

      enqueueSnackbar(t('message.votingDeleteSuccess'), {
        variant: 'success',
      });

      router.push(`/${login}/voting`);
    } catch (e) {
      enqueueSnackbar(
        t([`message.${getErrorMessageKey(e)}`, 'message.votingDeleteFailure']),
        { variant: 'error' },
      );
    }
  };

  const disabled = updateVotingResult.isLoading || deleteVotingResult.isLoading;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'flex-start',
      }}
    >
      {buttons.includes('close') && (
        <Button
          color="primary"
          startIcon={canManageVotes ? <LockIcon /> : <LockOpenIcon />}
          disabled={disabled}
          onClick={handleToggleVoting}
        >
          {canManageVotes ? t('closeVoting') : t('openVoting')}
        </Button>
      )}

      {buttons.includes('edit') && (
        <Button
          startIcon={<EditIcon />}
          disabled={disabled}
          onClick={() => setIsVotingFormOpened(true)}
        >
          {t('edit', { ns: 'common' })}
        </Button>
      )}

      {buttons.includes('delete') && (
        <Button
          startIcon={<DeleteIcon />}
          disabled={disabled}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          {t('delete', { ns: 'common' })}
        </Button>
      )}

      <VotingFormModal
        open={isVotingFormOpened}
        title={t('editVoting')}
        cancelButtonText={t('cancel', { ns: 'common' })}
        submitButtonText={t('save', { ns: 'common' })}
        defaultValues={getVotingFormValues(voting)}
        onClose={() => setIsVotingFormOpened(false)}
        onSubmit={handleEditVoting}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title={t('deleteVoting')}
        description={t('deleteVotingDialog')}
        handleClose={() => setIsDeleteDialogOpen(false)}
        handleYes={handleDeleteVoting}
      />
    </Box>
  );
};

export default VotingActions;
