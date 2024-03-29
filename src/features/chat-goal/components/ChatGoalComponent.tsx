import { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Typography,
  Paper,
  Button,
  Tooltip,
  Box,
  Grid,
  IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useChannelLogin from 'hooks/useChannelLogin';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { ChatGoalStatus } from 'features/api/apiConstants';
import getErrorMessage from 'features/api/utils/getErrorMessage';
import {
  useMeQuery,
  useMeRolesQuery,
  useUserQuery,
  useChatGoalQuery,
  useCreateChatGoalMutation,
  usePauseChatGoalMutation,
  useResetChatGoalMutation,
  useResetChatGoalVotesMutation,
  useStartChatGoalMutation,
  useUpdateChatGoalMutation,
} from 'features/api/apiSlice';
import ChatGoalWidget from './ChatGoalWidget';
import ChatGoalOptions from './ChatGoalOptions';
import getWidgetLink from '../utils/getWidgetLink';

const ChatGoalComponent = () => {
  const [isClearVotesDialogOpen, setIsClearVotesDialogOpen] = useState(false);

  const login = useChannelLogin();
  const channel = useUserQuery({ login: login! }, { skip: !login });
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login: login! }, { skip: !login });
  const goal = useChatGoalQuery(channel.data?.id as string, {
    skip: !channel.data,
  });

  const { enqueueSnackbar } = useSnackbar();

  const [createChatGoal, createChatGoalResult] = useCreateChatGoalMutation();
  const [updateChatGoal, updateChatGoalResult] = useUpdateChatGoalMutation();

  const [startChatGoal, startChatGoalResult] = useStartChatGoalMutation();
  const [pauseChatGoal, pauseChatGoalResult] = usePauseChatGoalMutation();
  const [resetChatGoal, resetChatGoalResult] = useResetChatGoalMutation();
  const [resetChatGoalVotes, resetChatGoalVotesResult] =
    useResetChatGoalVotesMutation();

  if (!me.data || !meRoles.data || !channel.data) return null;

  const canManage = me.data?.id === channel.data?.id || meRoles.data?.editor;

  if (!canManage) return null;

  const isDisabled =
    createChatGoalResult.isLoading ||
    updateChatGoalResult.isLoading ||
    startChatGoalResult.isLoading ||
    pauseChatGoalResult.isLoading ||
    resetChatGoalResult.isLoading ||
    resetChatGoalVotesResult.isLoading;

  const isGoalRunning =
    goal.data?.status === ChatGoalStatus.TimerRunning ||
    goal.data?.status === ChatGoalStatus.VotingRunning;

  const widgetLink = getWidgetLink(goal.data?.broadcasterId || '');

  const handleToggleListening = async () => {
    if (!goal.isSuccess) return;

    let error: string | null = null;
    let listening = false;

    if (goal.data) {
      listening = !goal.data?.listening;

      try {
        await updateChatGoal({
          chatGoalId: goal.data.broadcasterId,
          body: { listening },
        }).unwrap();
      } catch (e) {
        error = getErrorMessage(e);
      }
    } else {
      listening = true;

      try {
        await createChatGoal({
          broadcasterId: channel.data!.id,
          listening,
        }).unwrap();
      } catch (e) {
        error = getErrorMessage(e);
      }
    }

    if (error) {
      enqueueSnackbar(error || 'Не удалось включить чатгол', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(listening ? 'Чатгол включен' : 'Чатгол выключен', {
        variant: 'success',
      });
    }
  };

  const handleResetUserVotes = async () => {
    try {
      await resetChatGoalVotes(channel.data!.id).unwrap();

      enqueueSnackbar(
        'Количество потраченных пользователями голосов обнулено',
        { variant: 'success' },
      );
    } catch (e) {
      enqueueSnackbar(
        getErrorMessage(e) ||
          'Не удалось обнулить количество потраченных пользователями голосов',
        { variant: 'error' },
      );
    }
  };

  const renderControls = () => (
    <Typography variant="body2" component="div">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={isGoalRunning ? <PauseIcon /> : <PlayArrowIcon />}
          sx={{ mr: 1 }}
          disabled={
            isDisabled || goal.data?.status === ChatGoalStatus.VotingFinished
          }
          onClick={() =>
            isGoalRunning
              ? pauseChatGoal(goal.data?.broadcasterId as string)
              : startChatGoal(goal.data?.broadcasterId as string)
          }
        >
          {isGoalRunning ? 'Пауза' : 'Старт'}
        </Button>
        <Button
          startIcon={<ClearIcon />}
          sx={{ mr: 1 }}
          disabled={isDisabled}
          onClick={() => resetChatGoal(goal.data?.broadcasterId as string)}
        >
          Сброс
        </Button>
        <Tooltip title="Обнулить количество потраченных пользователями голосов">
          <Button
            startIcon={<ClearAllIcon />}
            disabled={isDisabled}
            onClick={() => setIsClearVotesDialogOpen(true)}
          >
            Сброс голосов
          </Button>
        </Tooltip>
      </Box>
    </Typography>
  );

  const renderChatGoalPreview = () => (
    <Box>
      <Typography variant="h6" component="div" mb={2}>
        Предпросмотр
      </Typography>

      <Box mb={2}>
        <ChatGoalWidget id={goal.data?.broadcasterId} />
      </Box>

      <Typography variant="h6" component="div" mb={2}>
        Ссылка для OBS/XSplit
      </Typography>

      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box>{widgetLink}</Box>

        <Tooltip title="Скопировать ссылку">
          <IconButton
            sx={{ ml: 'auto', flexShrink: 0 }}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(widgetLink);
              } catch (e) {}

              enqueueSnackbar('Ссылка скопирована', { variant: 'success' });
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </Box>
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={6}>
          <Button
            variant="contained"
            color={goal.data?.listening ? 'success' : 'error'}
            startIcon={goal.data?.listening ? <LockOpenIcon /> : <LockIcon />}
            sx={{ mb: 2 }}
            disabled={isDisabled}
            onClick={handleToggleListening}
          >
            {goal.data?.listening ? 'Закрыть чатгол' : 'Открыть чатгол'}
          </Button>
          {goal.data?.listening && renderControls()}
          {goal.data?.listening && renderChatGoalPreview()}
        </Grid>
        <Grid item lg={6}>
          {goal.data?.listening && <ChatGoalOptions />}
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={isClearVotesDialogOpen}
        title="Сбросить голоса"
        description="Вы действительно хотите обнулить количество потраченных пользователями голосов?"
        handleClose={() => setIsClearVotesDialogOpen(false)}
        handleYes={handleResetUserVotes}
      />
    </>
  );
};

export default ChatGoalComponent;
