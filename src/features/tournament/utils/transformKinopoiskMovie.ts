import { Film } from "features/kinopoisk-api/kinopoiskApiTypes";
import { Movie } from "../types";

const transformKinopoiskMovie = (movie: Film): Movie => ({
  id: `${movie.filmId}`,
  title: movie.nameRu || movie.nameEn || " ",
  info: movie,
});

export default transformKinopoiskMovie;
