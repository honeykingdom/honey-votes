import { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  SWITCHES,
  USER_TYPES,
  VOTING_OPTION_TYPES,
} from 'features/voting/votingConstants';
import FormControlSelect from './FormControlSelect';
import type { VotingFormParams } from './VotingFormModal';

const VOTING_OPTIONS_LIMIT_MARKS = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1) * 20,
  label: `${(i + 1) * 20}`,
}));

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
  const [t] = useTranslation(['voting', 'common']);
  const [isExtended, setIsExtended] = useState(
    getInitialIsExtended(defaultValues),
  );
  const { control, register } = useFormReturn;

  const renderSubTierMenuItems = () =>
    SUB_TIERS.map((value) => (
      <MenuItem key={value} value={value}>
        {t(`subTier.${value}`, { ns: 'common' })}
      </MenuItem>
    ));

  const renderFollowedTimeMenuItems = () =>
    FOLLOWED_TIME_VALUES.map((value) => (
      <MenuItem key={value} value={value}>
        {t(`followedTime.${value}`, { ns: 'common' })}
      </MenuItem>
    ));

  return (
    <>
      <FormGroup sx={{ mb: 2 }}>
        <TextField
          id="title"
          label={t('title', { ns: 'common' })}
          variant="outlined"
          inputProps={{ maxLength: apiSchema.Voting.title.maxLength }}
          {...register('title')}
        />
      </FormGroup>

      <FormGroup sx={{ mb: 2 }}>
        <TextField
          id="description"
          label={t('description', { ns: 'common' })}
          multiline
          rows={2}
          variant="outlined"
          inputProps={{ maxLength: apiSchema.Voting.description.maxLength }}
          {...register('description')}
        />
      </FormGroup>

      <Box mb={2}>
        <FormGroup>
          {SWITCHES.map((name) => (
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
              label={t(`votingForm.${name}`) as string}
            />
          ))}
        </FormGroup>
      </Box>

      <Box mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t('votingForm.votingOptionTypes')}
          </FormLabel>
          <FormGroup>
            {VOTING_OPTION_TYPES.map((name) => (
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
                label={t(`votingOption.${name}.label_many`) as string}
                value={name}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>

      <Box mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t('votingForm.whoCanVote')}</FormLabel>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            {USER_TYPES.map((type) => (
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
                label={t(`userType.${type}_many`, { ns: 'common' }) as string}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: isExtended ? 'flex' : 'none' }}>
          <Box width={240} mr={2}>
            <FormControlSelect
              id="subTierRequiredToVote"
              name={`permissions.${TwitchUserType.Sub}.subTierRequiredToVote`}
              label={t('votingForm.subTierRequired')}
              control={control}
            >
              {renderSubTierMenuItems()}
            </FormControlSelect>
          </Box>
          <Box width={240}>
            <FormControlSelect
              id="minutesToFollowRequiredToVote"
              name={`permissions.${TwitchUserType.Follower}.minutesToFollowRequiredToVote`}
              label={t('votingForm.minutesToFollowRequired')}
              control={control}
            >
              {renderFollowedTimeMenuItems()}
            </FormControlSelect>
          </Box>
        </Box>
      </Box>

      <Box mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t('votingForm.whoCanAddOptions')}
            <Tooltip title={t('votingForm.whoCanAddOptionsTooltip') as string}>
              <InfoIcon
                sx={{ verticalAlign: 'middle', fontSize: '1.2rem', ml: 1 }}
              />
            </Tooltip>
          </FormLabel>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            {USER_TYPES.map((type) => (
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
                label={t(`userType.${type}_many`, { ns: 'common' }) as string}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: isExtended ? 'flex' : 'none' }}>
          <Box width={240} mr={2}>
            <FormControlSelect
              id="subTierRequiredToAddOptions"
              name={`permissions.${TwitchUserType.Sub}.subTierRequiredToAddOptions`}
              label={t('votingForm.subTierRequired')}
              control={control}
            >
              {renderSubTierMenuItems()}
            </FormControlSelect>
          </Box>
          <Box width={240}>
            <FormControlSelect
              id="minutesToFollowRequiredToAddOptions"
              name={`permissions.${TwitchUserType.Follower}.minutesToFollowRequiredToAddOptions`}
              label={t('votingForm.minutesToFollowRequired')}
              control={control}
            >
              {renderFollowedTimeMenuItems()}
            </FormControlSelect>
          </Box>
        </Box>
      </Box>

      <Box mb={2}>
        <FormControl sx={{ minWidth: 420 }}>
          <FormLabel>{t('votingForm.votingOptionsLimit')}</FormLabel>
          <Controller
            name="votingOptionsLimit"
            control={control}
            render={({ field }) => (
              <Slider
                aria-label={t('votingForm.votingOptionsLimit')}
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
          ? t('votingForm.hideExtendedOptions')
          : t('votingForm.showExtendedOptions')}
      </Button>
    </>
  );
};

export default VotingForm;
