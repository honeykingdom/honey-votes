import { memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  CardActionArea,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import { KinopoiskMovie } from "api/kinopoisk";
import { getMovieDescription } from './utils/getMovieDescription';
import { CardSize, Movie } from './tournamentTypes';
import {
  CARD_HEIGHT_MAP,
  CARD_IMAGE_WIDTH_MAP,
  NO_POSTER_URL,
} from './tournamentConstants';
// import MoviePicker from "./MoviePicker";

type Props = {
  movie: Movie;
  size?: CardSize;
  mode?: 'view' | 'edit';
  active?: boolean;
  value?: string;
  // value?: KinopoiskMovie;
  // inputValue: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onDone?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onChange?: (movie?: Movie) => void;
  // onInputChange?: (value?: string) => void;
};

const MovieCard = ({
  movie,
  size = 'medium',
  mode = 'view',
  active = false,
  value,
  // inputValue = "",
  onClick = () => {},
  onDelete = () => {},
  onEdit = () => {},
  onDone = () => {},
  // onInputChange = () => {},
  onChange = () => {},
}: Props) => {
  const { filmId, year } = movie.info || {};
  const cardHeight = CARD_HEIGHT_MAP[size] || 'auto';

  // const [movieTitle, setMovieTitle] = useState("");
  // const [suggestions, setSuggestions] = useState<KinopoiskMovie[]>([]);

  const renderMovieInfo = () => (
    <>
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Typography component="span" variant="body1" title={movie.title}>
          {movie.title}
        </Typography>{' '}
        {year && size === 'small' && (
          <Typography
            component="span"
            variant="subtitle1"
            color="text.secondary"
          >
            ({year})
          </Typography>
        )}
      </Box>
      {size !== 'small' && (
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{ opacity: 0.5 }}
        >
          {getMovieDescription(movie.info)}
        </Typography>
      )}
    </>
  );

  // const renderMoviePicker = () => (
  //   <MoviePicker
  //     size={size === "small" ? "small" : "medium"}
  //     value={movie}
  //     inputValue={inputValue}
  //     onChange={onChange}
  //     onInputChange={onInputChange}
  //   />
  // );

  const renderEditField = () => (
    <TextField
      size={size === 'small' ? 'small' : 'medium'}
      value={value}
      onChange={onChange}
    />
  );

  const renderActions = () => (
    <Box
      display="flex"
      sx={{
        p: 1,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        visibility: 'hidden',
      }}
    >
      <Tooltip title="Редактировать">
        <IconButton
          size="small"
          aria-label="редактировать"
          sx={{ mr: 1, opacity: 0.5 }}
          onClick={onEdit}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Удалить">
        <IconButton
          size="small"
          aria-label="удалить"
          sx={{ opacity: 0.5 }}
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // const renderDoneButton = () => (
  //   <Box
  //     sx={{
  //       p: 1,
  //       position: "absolute",
  //       right: 0,
  //       top: "50%",
  //       transform: "translateY(-50%)",
  //     }}
  //   >
  //     <Button variant="contained" onClick={onDone} sx={{ width: 76 }}>
  //       Готово
  //     </Button>
  //   </Box>
  // );

  return (
    <Card
      sx={{
        display: 'flex',
        position: 'relative',
        height: cardHeight,
        '&:hover :last-child': {
          visibility: 'visible',
        },
        bgcolor: active ? 'rgba(102, 187, 106, 0.53)' : undefined,
      }}
    >
      <a
        href={filmId ? `//kinopoisk.ru/film/${filmId}/` : null}
        target="_blank"
        style={{
          display: 'block',
          width: CARD_IMAGE_WIDTH_MAP[size],
          flexShrink: 0,
        }}
      >
        <CardMedia
          sx={{ height: '100%' }}
          image={movie.info?.posterUrlPreview || NO_POSTER_URL}
          title={movie.title}
        />
      </a>
      <CardActionArea
        disableRipple={mode === 'edit'}
        onClick={() => {
          if (mode === 'edit') return;

          onClick();
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            flexGrow: 1,
            // width: mode === "view" ? "calc(100% - 76px)" : "auto",
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: '1 0 auto',
              py: 0,
            }}
          >
            {mode === 'view' && renderMovieInfo()}
            {/* {mode === "edit" && renderMoviePicker()} */}
            {mode === 'edit' && renderEditField()}
          </CardContent>
          <span />
        </Box>
      </CardActionArea>

      {/* {mode === "view" && renderActions()} */}
      {/* {mode === "edit" && renderDoneButton()} */}
    </Card>
  );
};

export default memo(MovieCard);
