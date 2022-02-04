import { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getYear } from 'date-fns';
import {
  Box,
  FormGroup,
  Link,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CreateVotingOptionDto } from 'features/api/apiTypes';
import { VotingOptionType } from 'features/api/apiConstants';
import apiSchema from 'features/api/apiSchema.json';
import { Film } from 'features/kinopoisk-api/kinopoiskApiTypes';
import { IgdbGame } from 'features/igdb-api/igdbApiSlice';
import { VOTING_OPTION_TYPES } from 'features/voting/votingConstants';
import VotingOptionAutocomplete from './VotingOptionAutocomplete';

// TODO: sync with backend
const KP = {
  getOptionLabel: (option: Film) =>
    `${option.nameRu || option.nameEn}${
      option.year ? ` (${option.year})` : ''
    }`,
  getOptionTitle: (option: Film) => option.nameRu || option.nameEn || '',
  getOptionDescription: (option: Film) =>
    `${[option.year, option.genres?.map((g) => g.genre).join(', ')]
      .filter(Boolean)
      .join(' - ')}`,
  getOptionImage: (option: Film) => option.posterUrlPreview || '',
  isOptionEqualToValue: (option: Film, value: Film) =>
    option.filmId === value.filmId,
};

const IGDB = {
  getOptionLabel: (option: IgdbGame) =>
    `${option.name}${
      option.first_release_date
        ? ` (${getYear(option.first_release_date * 1000)})`
        : ''
    }`,
  getOptionTitle: (option: IgdbGame) => option.name || '',
  getOptionDescription: (option: IgdbGame) =>
    `${[
      option.first_release_date
        ? getYear(option.first_release_date * 1000)
        : null,
      option.genres?.map((g) => g.name).join(', '),
    ]
      .filter(Boolean)
      .join(' - ')}`,
  getOptionImage: (option: IgdbGame) =>
    option.cover
      ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${option.cover?.image_id}.jpg`
      : 'https://images.igdb.com/igdb/image/upload/t_cover_small/nocover.png',
  isOptionEqualToValue: (option: IgdbGame, value: IgdbGame) =>
    option.slug === value.slug,
};

enum FieldType {
  Search = 'search',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Link = 'link',
}

type VotingOptionDefaultValues = Omit<CreateVotingOptionDto, 'votingId'>;

type Props = {
  useFormReturn: UseFormReturn<VotingOptionDefaultValues>;
  allowedVotingOptionTypes: VotingOptionType[];
};

const VotingOptionForm = ({
  useFormReturn,
  allowedVotingOptionTypes,
}: Props) => {
  const [t] = useTranslation(['voting', 'common']);
  const [fieldType, setFieldType] = useState(FieldType.Search);

  const { control, register, watch, setValue } = useFormReturn;

  const watchType = watch('type');

  const renderedVotingOptionTypes = VOTING_OPTION_TYPES.filter((name) =>
    allowedVotingOptionTypes.includes(name),
  );

  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Controller
          control={control}
          defaultValue={VotingOptionType.KinopoiskMovie}
          name="type"
          render={({ field }) => (
            <ToggleButtonGroup
              color="primary"
              size="small"
              value={field.value}
              exclusive
              sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
              onChange={(...args) => {
                setFieldType(FieldType.Search);
                field.onChange(...args);
              }}
            >
              {renderedVotingOptionTypes.map((name) => (
                <ToggleButton
                  key={name}
                  value={name}
                  sx={{ textTransform: 'none' }}
                >
                  {t(`votingOption.${name}.label_one`)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />

        {watchType !== VotingOptionType.Custom && (
          <ToggleButtonGroup
            color="primary"
            size="small"
            value={fieldType}
            exclusive
            sx={{ ml: { md: 'auto' }, mt: { xs: 2, md: 0 } }}
            onChange={(v: any) => setFieldType(v.target.value)}
          >
            <ToggleButton
              value={FieldType.Search}
              sx={{ textTransform: 'none' }}
            >
              {t('search', { ns: 'common' })}
            </ToggleButton>
            <ToggleButton value={FieldType.Link} sx={{ textTransform: 'none' }}>
              {watchType === VotingOptionType.KinopoiskMovie
                ? t('votingOptionForm.movieLink')
                : t('votingOptionForm.gameLink')}
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {watchType === VotingOptionType.Custom && (
        <>
          <FormGroup sx={{ mb: 2 }}>
            <TextField
              id="title"
              label={t('title', { ns: 'common' })}
              variant="outlined"
              inputProps={{
                maxLength: apiSchema.VotingOption.cardTitle.maxLength,
              }}
              {...register(`${VotingOptionType.Custom}.title`)}
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField
              id="description"
              label={t('description', { ns: 'common' })}
              multiline
              rows={2}
              variant="outlined"
              inputProps={{
                maxLength: apiSchema.VotingOption.cardDescription.maxLength,
              }}
              {...register(`${VotingOptionType.Custom}.description`)}
            />
          </FormGroup>
        </>
      )}

      {watchType === VotingOptionType.KinopoiskMovie && (
        <FormGroup sx={{ mb: 2 }}>
          {fieldType === FieldType.Search && (
            <>
              <Controller
                name={`${VotingOptionType.KinopoiskMovie}.id`}
                control={control}
                render={({ field: { name, onBlur } }) => (
                  <VotingOptionAutocomplete
                    id="movieId"
                    name={name}
                    label={t('votingOptionForm.movieName')}
                    type={VotingOptionType.KinopoiskMovie}
                    onBlur={onBlur}
                    onChange={(e, value) => setValue(name, value?.filmId)}
                    {...KP}
                  />
                )}
              />

              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {t('votingOptionForm.movieNameTooltip')}
              </Typography>
            </>
          )}

          {fieldType === FieldType.Link && (
            <>
              <TextField
                id="movieLink"
                label={t('votingOptionForm.movieLinkKinopoisk')}
                variant="outlined"
                sx={{ mb: 2 }}
                {...register(`${VotingOptionType.KinopoiskMovie}.id`, {
                  setValueAs: (v) => {
                    if (typeof v !== 'string' || !v) return v;

                    const id = v.replace(
                      /https:\/\/www\.kinopoisk\.ru\/film\/(\d+)\/?/,
                      '$1',
                    );

                    return Number.parseInt(id, 10);
                  },
                })}
              />

              <Typography color="text.secondary">
                <Link
                  href="https://www.kinopoisk.ru"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  https://www.kinopoisk.ru
                </Link>
                <br />
                {t('example', { ns: 'common' })}:
                https://www.kinopoisk.ru/film/258687/
              </Typography>
            </>
          )}
        </FormGroup>
      )}

      {watchType === VotingOptionType.IgdbGame && (
        <FormGroup sx={{ mb: 2 }}>
          {fieldType === FieldType.Search && (
            <>
              <Controller
                name={`${VotingOptionType.IgdbGame}.slug`}
                control={control}
                render={({ field: { name, onBlur } }) => (
                  <VotingOptionAutocomplete
                    id="gameSlug"
                    name={name}
                    label={t('votingOptionForm.gameName')}
                    type={VotingOptionType.IgdbGame}
                    onBlur={onBlur}
                    onChange={(e, value) => setValue(name, value?.slug)}
                    {...IGDB}
                  />
                )}
              />

              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {t('votingOptionForm.gameNameTooltip')}
              </Typography>
            </>
          )}

          {fieldType === FieldType.Link && (
            <>
              <TextField
                id="gameLink"
                label={t('votingOptionForm.gameLinkIgdb')}
                variant="outlined"
                sx={{ mb: 2 }}
                {...register(`${VotingOptionType.IgdbGame}.slug`, {
                  setValueAs: (v) => {
                    if (!v.startsWith('https://www.igdb.com/games/')) return v;

                    return v.replace('https://www.igdb.com/games/', '').trim();
                  },
                })}
              />

              <Typography color="text.secondary">
                <Link
                  href="https://www.igdb.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  https://www.igdb.com
                </Link>
                <br />
                {t('example', { ns: 'common' })}:
                https://www.igdb.com/games/metal-gear-solid
              </Typography>
            </>
          )}
        </FormGroup>
      )}
    </>
  );
};

export default VotingOptionForm;
