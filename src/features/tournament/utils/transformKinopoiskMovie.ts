import { KinopoiskMovie } from "features/kinopoisk-api/kinopoisk";
import { Movie } from "../types";

const transformKinopoiskMovie = (movie: KinopoiskMovie): Movie => ({
  id: `${movie.filmId}`,
  title: movie.nameRu || movie.nameEn || " ",
  info: movie,
});

export default transformKinopoiskMovie;
