import { Film } from 'features/kinopoisk-api/kinopoiskApiTypes';

export const getMovieDescription = (movie?: Film) => {
  return [movie?.year, movie?.genres?.map(({ genre }) => genre).join(', ')]
    .filter(Boolean)
    .join(' - ');
};
