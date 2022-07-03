import { Film } from 'features/kinopoisk-api/kinopoiskApiTypes';
import { Movie } from '../tournamentTypes';

const transformKinopoiskMovie = (movie: Film): Movie => ({
  id: `${movie.kinopoiskId}`,
  title: movie.nameRu || movie.nameEn || ' ',
  info: movie,
});

export default transformKinopoiskMovie;
