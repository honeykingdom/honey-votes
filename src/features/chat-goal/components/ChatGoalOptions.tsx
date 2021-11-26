import { useEffect, useState } from 'react';
import { Controller, useForm, UseFormRegisterReturn } from 'react-hook-form';
import * as R from 'ramda';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Tooltip,
  Divider,
  FormLabel,
  Checkbox,
  Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import TwitchBadge from 'components/TwitchBadge';
import useChannelLogin from 'hooks/useChannelLogin';
import { UpdateChatGoalDto } from 'features/api/apiTypes';
import { API_ERRORS, TwitchUserType } from 'features/api/apiConstants';
import {
  useChatGoalQuery,
  useUpdateChatGoalMutation,
  useUserQuery,
} from 'features/api/apiSlice';

const USER_TYPES_ITEMS = [
  { label: 'Модеры', type: TwitchUserType.Mod, badge: ['moderator'] },
  { label: 'Випы', type: TwitchUserType.Vip, badge: ['vip'] },
  {
    label: 'Сабы (Tier 1)',
    type: TwitchUserType.SubTier1,
    badge: ['subscriber', 0],
  },
  {
    label: 'Сабы (Tier 2)',
    type: TwitchUserType.SubTier2,
    badge: ['subscriber', 2000],
  },
  {
    label: 'Сабы (Tier 3)',
    type: TwitchUserType.SubTier3,
    badge: ['subscriber', 3000],
  },
  { label: 'Зрители', type: TwitchUserType.Viewer, badge: ['glhf-pledge'] },
] as const;

const pickOptions = R.pick<keyof UpdateChatGoalDto>([
  'permissions',
  'title',
  'upvoteCommand',
  'downvoteCommand',
  'maxVotesValue',
  'timerDuration',
]);

const withMui = ({ ref: inputRef, ...rest }: UseFormRegisterReturn) => ({
  ...rest,
  inputRef,
});

const ChatGoalOptions = () => {
  const { enqueueSnackbar } = useSnackbar();

  const login = useChannelLogin();
  const channel = useUserQuery({ login: login! }, { skip: !login });
  const goal = useChatGoalQuery(channel.data?.id as string, {
    skip: !channel.data,
  });

  const [updateChatGoal, updateChatGoalResult] = useUpdateChatGoalMutation();

  const [currentGoalOptions, setCurrentGoalOptions] =
    useState<UpdateChatGoalDto | null>(null);

  const { register, control, watch, reset, handleSubmit } =
    useForm<UpdateChatGoalDto>({
      defaultValues: goal?.data,
    });

  useEffect(() => {
    if (!goal.isSuccess) return;

    const options = pickOptions(goal.data);

    const timerDuration = Math.floor((options.timerDuration || 0) / 60 / 1000);

    const newOptions = { ...options, timerDuration };

    setCurrentGoalOptions(newOptions);

    reset(newOptions);
  }, [goal.isSuccess, goal.data]);

  if (!goal.isSuccess) return null;

  const values = watch();

  const isDisabled = updateChatGoalResult.isLoading;
  const isSaveButtonDisabled =
    isDisabled || R.equals(values, currentGoalOptions);

  const handleSaveOptions = handleSubmit(async (data, e) => {
    e!.preventDefault();

    const timerDuration = (data.timerDuration || 0) * 60 * 1000;

    const body = { ...data, timerDuration };

    try {
      await updateChatGoal({
        chatGoalId: goal.data.broadcasterId,
        body,
      }).unwrap();

      enqueueSnackbar('Настройки успешно сохранены', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(
        API_ERRORS[err.data?.message] || 'Не удалось обновить настройки',
        { variant: 'error' },
      );
    }
  });

  return (
    <Box component="form" onSubmit={handleSaveOptions}>
      <Typography variant="h6" component="div" mb={2}>
        Настройки
      </Typography>

      <Box mb={2}>
        <Box mb={2}>
          <TextField
            label="Заголовок"
            variant="outlined"
            fullWidth
            disabled={isDisabled}
            {...withMui(register('title'))}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item md={6}>
            <TextField
              label="Голосовать за"
              variant="outlined"
              fullWidth
              disabled={isDisabled}
              {...withMui(register('upvoteCommand'))}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Голосовать против"
              variant="outlined"
              fullWidth
              disabled={isDisabled}
              {...withMui(register('downvoteCommand'))}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={6}>
            <Tooltip title="Количество голосов, необходимое для завершения чатгола">
              <TextField
                label="Количество голосов"
                type="number"
                variant="outlined"
                fullWidth
                disabled={isDisabled}
                {...withMui(
                  register('maxVotesValue', { valueAsNumber: true, min: 0 }),
                )}
              />
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <Tooltip title="Отложить начало голосования на указанное время">
              <TextField
                type="number"
                label="Таймер (минут, 0 - без таймера)"
                variant="outlined"
                fullWidth
                disabled={isDisabled}
                {...withMui(
                  register('timerDuration', { valueAsNumber: true, min: 0 }),
                )}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Grid container sx={{ mb: 1 }}>
          <Grid item sm={6}>
            <FormLabel>Могут голосовать:</FormLabel>
          </Grid>
          <Grid item sm={2} sx={{ textAlign: 'center' }}>
            <FormLabel>За</FormLabel>
          </Grid>
          <Grid item sm={2} sx={{ textAlign: 'center' }}>
            <FormLabel>Против</FormLabel>
          </Grid>
          <Grid item sm={2} sx={{ textAlign: 'center' }}>
            <FormLabel>Голоса</FormLabel>
          </Grid>
        </Grid>
        {USER_TYPES_ITEMS.map(({ label, type, badge: [name, version] }) => (
          <Grid
            container
            key={type}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Grid item sm={6}>
              <TwitchBadge
                name={name}
                version={version}
                channelId={goal.data?.broadcasterId}
              />{' '}
              {label}
            </Grid>

            <Grid item sm={2} sx={{ textAlign: 'center' }}>
              <Controller
                name={`permissions.${type}.canUpvote`}
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <Checkbox
                    inputRef={ref}
                    checked={!!rest.value}
                    disabled={isDisabled}
                    {...rest}
                  />
                )}
              />
            </Grid>

            <Grid item sm={2} sx={{ textAlign: 'center' }}>
              <Controller
                name={`permissions.${type}.canDownvote`}
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <Checkbox
                    inputRef={ref}
                    checked={!!rest.value}
                    disabled={isDisabled}
                    {...rest}
                  />
                )}
              />
            </Grid>

            <Grid item sm={2} sx={{ textAlign: 'center' }}>
              <TextField
                id="title"
                size="small"
                type="number"
                variant="standard"
                fullWidth
                disabled={
                  isDisabled ||
                  (!values.permissions?.[type].canUpvote &&
                    !values.permissions?.[type].canDownvote)
                }
                sx={{ maxWidth: 64 }}
                {...withMui(
                  register(`permissions.${type}.votesAmount`, {
                    valueAsNumber: true,
                    min: 0,
                  }),
                )}
              />
            </Grid>
          </Grid>
        ))}
      </Box>

      <Button
        type="submit"
        variant="contained"
        startIcon={<SaveIcon />}
        disabled={isSaveButtonDisabled}
      >
        Сохранить
      </Button>
    </Box>
  );
};

export default ChatGoalOptions;
