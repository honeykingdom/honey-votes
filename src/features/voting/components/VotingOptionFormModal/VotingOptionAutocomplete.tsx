import { useMemo, useState } from "react";
import { debounce } from "lodash";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Film } from "features/kinopoisk-api/kinopoiskApiTypes";
import { useLazySearchMoviesQuery } from "features/kinopoisk-api/kinopoiskApiSlice";
import { Box } from "@mui/material";

const getOptionLabel = (option: Film) =>
  `${option.nameRu || option.nameEn}${option.year ? ` (${option.year})` : ""}`;
const getOptionImage = (option: Film) => option.posterUrlPreview;
const isOptionEqualToValue = (option: Film, value: Film) =>
  option.filmId === value.filmId;

type Props = {
  id: string;
  name: string;
  label: string;
  onBlur: () => void;
  onChange: (event: React.SyntheticEvent<Element, Event>, value: any) => void;
};

const VotingOptionAutocomplete = ({
  id,
  name,
  label,
  onBlur,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchMovies, searchMoviesResult] = useLazySearchMoviesQuery();

  const options = searchMoviesResult.data || [];
  const loading = open && searchMoviesResult.isLoading;

  const handleChange = useMemo(
    () =>
      debounce((event: React.ChangeEvent<{ value: string }>) => {
        const search = event.target.value;

        if (!search) return;

        searchMovies(search);
      }, 500),
    []
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
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width={32}
            src={getOptionImage(option)}
            alt={getOptionLabel(option)}
          />
          {getOptionLabel(option)}
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
