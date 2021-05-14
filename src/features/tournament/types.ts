import { KinopoiskMovie } from "api/kinopoisk";

export type Movie = {
  id: string;
  title: string;
  info?: KinopoiskMovie;
};

export type StepAddMovies = {
  type: "ADD_MOVIES";
  movies: Movie[];
};
export type StepStartTournament = {
  type: "START_TOURNAMENT";
  movies: Movie[];
};
export type StepViewersChoice = {
  type: "VIEWERS_CHOICE";
  movies: Movie[];
};
export type StepStreamerChoice = {
  type: "STREAMER_CHOICE";
  movies: Movie[];
};
export type StepRandomChoice = {
  type: "RANDOM_CHOICE";
  movies: Movie[];
};
export type StepShowWinner = {
  type: "SHOW_WINNER";
  movies: Movie[];
};

export type Step =
  | StepAddMovies
  | StepStartTournament
  | StepViewersChoice
  | StepStreamerChoice
  | StepRandomChoice
  | StepShowWinner;
