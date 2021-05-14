import { KinopoiskMovie } from "api/kinopoisk";

export const getMovieDescription = (movie?: KinopoiskMovie) => {
  return [movie?.year, movie?.genres?.map(({ genre }) => genre).join(", ")]
    .filter(Boolean)
    .join(" - ");
};
