import { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Slider,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { UpdateVotingDto } from 'features/api/apiTypes';
import { SubTier, TwitchUserType } from 'features/api/apiConstants';
import apiSchema from 'features/api/apiSchema.json';
import {
  FOLLOWED_TIME_VALUES,
  SUB_TIERS,
  USER_TYPES_ITEMS,
  VOTING_OPTION_TYPES,
} from 'features/voting/votingConstants';
import FormControlSelect from './FormControlSelect';
import type { VotingFormParams } from './VotingFormModal';

const VOTING_OPTIONS_LIMIT_MARKS = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1) * 20,
  label: `${(i + 1) * 20}`,
}));

const SUB_TIER_MENU_ITEMS = SUB_TIERS.map(({ value, label }) => (
  <MenuItem key={value} value={value}>
    {label}
  </MenuItem>
));

const FOLLOWED_TIME_MENU_ITEMS = FOLLOWED_TIME_VALUES.map(
  ({ value, label }) => (
    <MenuItem key={value} value={value}>
      {label}
    </MenuItem>
  ),
);

const SWITCHES: { label: string; name: keyof UpdateVotingDto }[] = [
  { label: 'Открыть голосование', name: 'canManageVotes' },
  {
    label: 'Открыть добавление вариантов для голосования',
    name: 'canManageVotingOptions',
  },
  { label: 'Показывать голоса', name: 'showValues' },
];

const getInitialIsExtended = (values?: UpdateVotingDto) => {
  if (!values || !values.permissions) return false;

  return (
    values.permissions.follower.minutesToFollowRequiredToVote ||
    values.permissions.follower.minutesToFollowRequiredToAddOptions ||
    values.permissions.sub.subTierRequiredToVote !== SubTier.Tier1 ||
    values.permissions.sub.subTierRequiredToAddOptions !== SubTier.Tier1
  );
};

type Props = {
  defaultValues: UpdateVotingDto;
  useFormReturn: UseFormReturn<VotingFormParams>;
};

const VotingForm = ({ defaultValues, useFormReturn }: Props) => {
  const [isExtended, setIsExtended] = useState(
    getInitialIsExtended(defaultValues),
  );
  const { control, register } = useFormReturn;

  return (
    <>
      <FormGroup sx={{ mb: 2 }}>
        <TextField
          id="title"
          label="Заголовок"
          variant="outlined"
          inputProps={{ maxLength: apiSchema.Voting.title.maxLength }}
          {...register('title')}
        />
      </FormGroup>

      <FormGroup sx={{ mb: 2 }}>
        <TextField
          id="description"
          label="Описание"
          multiline
          rows={2}
          variant="outlined"
          inputProps={{ maxLength: apiSchema.Voting.description.maxLength }}
          {...register('description')}
        />
      </FormGroup>

      <Box mb={2}>
        <FormGroup>
          {SWITCHES.map(({ label, name }) => (
            <FormControlLabel
              key={name}
              control={
                <Controller
                  name={name}
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <Switch inputRef={ref} checked={!!rest.value} {...rest} />
                  )}
                />
              }
              label={label}
            />
          ))}
        </FormGroup>
      </Box>

      <Box mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Типы вариантов</FormLabel>
          <FormGroup>
            {VOTING_OPTION_TYPES.map(({ label, name }) => (
              <FormControlLabel
                key={name}
                control={
                  <Controller
                    name={`allowedVotingOptionTypes.${name}`}
                    control={control}
                    render={({ field: { ref, ...rest } }) => (
                      <Checkbox
                        inputRef={ref}
                        checked={!!rest.value}
                        {...rest}
                      />
                    )}
                  />
                }
                label={label}
                value={name}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>

      <Box mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Кто может голосовать</FormLabel>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            {USER_TYPES_ITEMS.map(({ label, type }) => (
              <FormControlLabel
                key={type}
                control={
                  <Controller
                    name={`permissions.${type}.canVote`}
                    control={control}
                    render={({ field: { ref, ...rest } }) => (
                      <Checkbox
                        inputRef={ref}
                        checked={!!rest.value}
                        {...rest}
                      />
                    )}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: isExtended ? 'flex' : 'none' }}>
          <Box width={240} mr={2}>
            <FormControlSelect
              id="subTierRequiredToVote"
              name={`permissions.${TwitchUserType.Sub}.subTierRequiredToVote`}
              label="Минимальный уровень подписки"
              control={control}
            >
              {SUB_TIER_MENU_ITEMS}
            </FormControlSelect>
          </Box>
          <Box width={240}>
            <FormControlSelect
              id="minutesToFollowRequiredToVote"
              name={`permissions.${TwitchUserType.Follower}.minutesToFollowRequiredToVote`}
              label="Минимальное время фоллова"
              control={control}
            >
              {FOLLOWED_TIME_MENU_ITEMS}
            </FormControlSelect>
          </Box>
        </Box>
      </Box>

      <Box mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Кто может добавлять варианты для голосования
            <Tooltip title="Владелец канала и редакторы всегда могут создавать и удалять варианты для голосования">
              <InfoIcon
                sx={{ verticalAlign: 'middle', fontSize: '1.2rem', ml: 1 }}
              />
            </Tooltip>
          </FormLabel>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            {USER_TYPES_ITEMS.map(({ label, type }) => (
              <FormControlLabel
                key={type}
                control={
                  <Controller
                    name={`permissions.${type}.canAddOptions`}
                    control={control}
                    render={({ field: { ref, ...rest } }) => (
                      <Checkbox
                        inputRef={ref}
                        checked={!!rest.value}
                        {...rest}
                      />
                    )}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: isExtended ? 'flex' : 'none' }}>
          <Box width={240} mr={2}>
            <FormControlSelect
              id="subTierRequiredToAddOptions"
              name={`permissions.${TwitchUserType.Sub}.subTierRequiredToAddOptions`}
              label="Минимальный уровень подписки"
              control={control}
            >
              {SUB_TIER_MENU_ITEMS}
            </FormControlSelect>
          </Box>
          <Box width={240}>
            <FormControlSelect
              id="minutesToFollowRequiredToAddOptions"
              name={`permissions.${TwitchUserType.Follower}.minutesToFollowRequiredToAddOptions`}
              label="Минимальное время фоллова"
              control={control}
            >
              {FOLLOWED_TIME_MENU_ITEMS}
            </FormControlSelect>
          </Box>
        </Box>
      </Box>

      <Box mb={2}>
        <FormControl>
          <FormLabel>
            Максимальное количество вариантов для голосования
          </FormLabel>
          <Controller
            name="votingOptionsLimit"
            control={control}
            render={({ field }) => (
              <Slider
                aria-label="Максимальное количество вариантов для голосования"
                valueLabelDisplay="auto"
                step={2}
                min={apiSchema.Voting.votingOptionsLimit.minimum}
                max={apiSchema.Voting.votingOptionsLimit.maximum}
                marks={VOTING_OPTIONS_LIMIT_MARKS}
                size="small"
                defaultValue={defaultValues.votingOptionsLimit}
                {...field}
              />
            )}
          />
        </FormControl>
      </Box>

      <Button onClick={() => setIsExtended((v) => !v)}>
        {isExtended
          ? 'Скрыть расширенные настройки'
          : 'Показать расширенные настройки'}
      </Button>
    </>
  );
};

export default VotingForm;
