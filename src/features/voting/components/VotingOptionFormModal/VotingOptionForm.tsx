import { Controller, UseFormReturn } from "react-hook-form";
import {
  Box,
  FormGroup,
  Link,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { CreateVotingOptionDto, VotingOptionType } from "features/api/types";
import {
  VOTING_OPTION_CARD_DESCRIPTION_MAX_LENGTH,
  VOTING_OPTION_CARD_TITLE_MAX_LENGTH,
} from "features/api/apiConstants";
import VotingOptionAutocomplete from "./VotingOptionAutocomplete";

const VOTING_OPTION_TYPES = [
  { label: "Пользовательский вариант", name: VotingOptionType.Custom },
  { label: "Фильм (kinopoisk.ru)", name: VotingOptionType.KinopoiskMovie },
  { label: "Игра (IGDB.com)", name: VotingOptionType.IgdbGame },
] as const;

type VotingOptionDefaultValues = Omit<CreateVotingOptionDto, "votingId">;

type Props = {
  defaultValues: VotingOptionDefaultValues;
  useFormReturn: UseFormReturn<VotingOptionDefaultValues>;
  allowedVotingOptionTypes: VotingOptionType[];
};

const VotingOptionForm = ({
  defaultValues,
  useFormReturn,
  allowedVotingOptionTypes,
}: Props) => {
  const { control, register, watch, setValue } = useFormReturn;

  const watchType = watch("type");

  const renderedVotingOptionTypes = VOTING_OPTION_TYPES.filter(({ name }) =>
    allowedVotingOptionTypes.includes(name)
  );

  return (
    <>
      <Box mb={2}>
        <Controller
          control={control}
          defaultValue={VotingOptionType.KinopoiskMovie}
          // @ts-expect-error
          name="type"
          render={({ field }) => (
            <ToggleButtonGroup
              color="primary"
              size="small"
              value={field.value}
              exclusive
              onChange={field.onChange}
            >
              {renderedVotingOptionTypes.map(({ label, name }) => (
                <ToggleButton key={name} value={name}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />
      </Box>

      {watchType === VotingOptionType.Custom && (
        <>
          <FormGroup sx={{ mb: 2 }}>
            <TextField
              id="title"
              label="Заголовок"
              variant="outlined"
              inputProps={{ maxLength: VOTING_OPTION_CARD_TITLE_MAX_LENGTH }}
              {...register(`${VotingOptionType.Custom}.title`)}
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField
              id="description"
              label="Описание"
              multiline
              rows={2}
              variant="outlined"
              inputProps={{
                maxLength: VOTING_OPTION_CARD_DESCRIPTION_MAX_LENGTH,
              }}
              {...register(`${VotingOptionType.Custom}.description`)}
            />
          </FormGroup>
        </>
      )}

      {watchType === VotingOptionType.KinopoiskMovie && (
        <FormGroup sx={{ mb: 2 }}>
          <Controller
            name={`${VotingOptionType.KinopoiskMovie}.id`}
            control={control}
            render={({ field: { name, onBlur } }) => (
              <VotingOptionAutocomplete
                id="movieId"
                name={name}
                label="Фильм"
                onBlur={onBlur}
                onChange={(e, value) => setValue(name, value?.filmId)}
              />
            )}
          />
        </FormGroup>
      )}

      {watchType === VotingOptionType.IgdbGame && (
        <FormGroup sx={{ mb: 2 }}>
          <TextField
            id="title"
            label="Ссылка на игру с сайта IGDB.com"
            variant="outlined"
            sx={{ mb: 2 }}
            {...register(`${VotingOptionType.IgdbGame}.slug`)}
          />

          <Typography color="text.secondary">
            <Link href="https://igdb.com" target="_blank">
              https://igdb.com
            </Link>
            <br />
            Пример: https://www.igdb.com/games/metal-gear-solid
          </Typography>
        </FormGroup>
      )}
    </>
  );
};

export default VotingOptionForm;
