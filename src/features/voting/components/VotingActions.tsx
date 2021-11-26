import * as R from 'ramda';
import { useState } from 'react';
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
import { API_ERRORS } from 'features/api/apiConstants';
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

      enqueueSnackbar('Голосование успешно обновлено', { variant: 'success' });
    } catch (e: any) {
      enqueueSnackbar(
        API_ERRORS[e.data?.message] || 'Не удалось обновить голосование',
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

      enqueueSnackbar('Голосование успешно удалено', { variant: 'success' });

      router.push(`/${login}/voting`);
    } catch (e: any) {
      enqueueSnackbar(
        API_ERRORS[e.data?.message] || 'Не удалось удалить голосование',
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
          {canManageVotes ? 'Закрыть голосование' : 'Открыть голосование'}
        </Button>
      )}

      {buttons.includes('edit') && (
        <Button
          startIcon={<EditIcon />}
          disabled={disabled}
          onClick={() => setIsVotingFormOpened(true)}
        >
          Редактировать
        </Button>
      )}

      {buttons.includes('delete') && (
        <Button
          startIcon={<DeleteIcon />}
          disabled={disabled}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Удалить
        </Button>
      )}

      <VotingFormModal
        open={isVotingFormOpened}
        title="Редактировать голосование"
        cancelButtonText="Отмена"
        submitButtonText="Сохранить"
        defaultValues={getVotingFormValues(voting)}
        onClose={() => setIsVotingFormOpened(false)}
        onSubmit={handleEditVoting}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Удаление голосования"
        description="Вы действительно хотите удалить голосование?"
        handleClose={() => setIsDeleteDialogOpen(false)}
        handleYes={handleDeleteVoting}
      />
    </Box>
  );
};

export default VotingActions;
