import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { getMovieDescription } from "./utils/getMovieDescription";
import { Movie } from "./tournamentTypes";
import transformKinopoiskMovie from "./utils/transformKinopoiskMovie";

type Props = {
  value?: Movie;
  inputValue?: string;
  size?: "small" | "medium";
  autoFocus?: boolean;
  onChange?: (movie: Movie) => void;
  onInputChange?: (movie: string) => void;
};

const MoviePicker = ({
  value,
  inputValue = "",
  size = "small",
  autoFocus = false,
  onChange = () => {},
  onInputChange = () => {},
}: Props) => {
  const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Movie[]>([]);

  // const [value, setValue] = useState<Movie>(initialValue);
  // const [inputValue, setInputValue] = useState("");

  // useEffect(() => {
  //   if (open && inputValue.trim()) {
  //     setLoading(true);
  //   }
  // }, [open, inputValue]);

  useDebounce(
    () => {
      let active = true;

      // if (!loading) return undefined;

      (async () => {
        if (!inputValue.trim()) {
          setOptions([]);

          return;
        }

        // const response = await searchByKeyword(inputValue.trim());

        if (!active) return;

        // setOptions(response?.films.map(transformKinopoiskMovie) || []);
        // setLoading(false);
      })();

      return () => {
        active = false;
      };
    },
    500,
    [inputValue]
  );

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      options={options}
      value={value}
      inputValue={inputValue}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      // loading={loading}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField
          {...params}
          size={size}
          autoFocus={autoFocus}
          // InputProps={{
          //   ...params.InputProps,
          //   endAdornment: (
          //     <>
          //       {loading ? (
          //         <CircularProgress color="inherit" size={20} />
          //       ) : null}
          //       {params.InputProps.endAdornment}
          //     </>
          //   ),
          // }}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Box display="flex">
            <img
              src={option.info.posterUrlPreview}
              alt={option.title}
              style={{ width: 32, marginRight: 8 }}
            />
            <Box>
              <Typography
                component="div"
                variant="body1"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {option.title}
              </Typography>
              <Typography
                component="div"
                color="text.secondary"
                variant="body2"
                sx={{ opacity: 0.5 }}
              >
                {getMovieDescription(option.info)}
              </Typography>
            </Box>
          </Box>
        </li>
      )}
      onChange={(_, movie: Movie) => {
        // setValue(movie);
        onChange(movie);
      }}
      onInputChange={(_, movie) => {
        // setInputValue(value);
        onInputChange(movie);
      }}
    />
  );
};

export default MoviePicker;
