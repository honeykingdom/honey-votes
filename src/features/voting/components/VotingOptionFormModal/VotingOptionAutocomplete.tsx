import { useMemo, useState } from 'react';
import { debounce } from 'lodash';
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { VotingOptionType } from 'features/api/apiConstants';
import { useLazySearchMoviesQuery } from 'features/kinopoisk-api/kinopoiskApiSlice';
import { useLazySearchGamesQuery } from 'features/igdb-api/igdbApiSlice';

type Props = {
  id: string;
  name: string;
  label: string;
  type: VotingOptionType.KinopoiskMovie | VotingOptionType.IgdbGame;
  getOptionLabel: (option: any) => string;
  getOptionImage: (option: any) => string;
  getOptionTitle: (option: any) => string;
  getOptionDescription: (option: any) => string;
  isOptionEqualToValue: (option: any, value: any) => boolean;
  onBlur: () => void;
  onChange: (event: React.SyntheticEvent<Element, Event>, value: any) => void;
};

const VotingOptionAutocomplete = ({
  id,
  name,
  label,
  type,
  getOptionLabel,
  getOptionImage,
  getOptionTitle,
  getOptionDescription,
  isOptionEqualToValue,
  onBlur,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchMovies, searchMoviesResult] = useLazySearchMoviesQuery();
  const [searchGames, searchGamesResult] = useLazySearchGamesQuery();

  const options =
    type === VotingOptionType.KinopoiskMovie
      ? searchMoviesResult.data || []
      : searchGamesResult.data || [];
  const loading =
    open && type === VotingOptionType.KinopoiskMovie
      ? searchMoviesResult.isLoading
      : searchGamesResult.isLoading;

  const handleChange = useMemo(
    () =>
      debounce((event: React.ChangeEvent<{ value: string }>) => {
        const search = event.target.value.trim();

        if (!search) return;

        if (type === VotingOptionType.KinopoiskMovie) searchMovies(search);
        if (type === VotingOptionType.IgdbGame) searchGames(search);
      }, 500),
    [],
  );

  return (
    <Autocomplete
      id={id}
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={onChange}
      onBlur={onBlur}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width={32}
            src={getOptionImage(option)}
            alt={getOptionLabel(option)}
          />
          <Box>
            <Typography variant="inherit">{getOptionTitle(option)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {getOptionDescription(option)}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          name={name}
          onChange={handleChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default VotingOptionAutocomplete;
