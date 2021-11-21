import { TwitchUserType } from "features/api/apiConstants";
import { Film } from "features/kinopoisk-api/kinopoiskApiTypes";

export type Movie = {
  id: string;
  title: string;
  info?: Film;
};

export enum StepType {
  ADD_MOVIES,
  START_TOURNAMENT,
  VIEWERS_CHOICE,
  STREAMER_CHOICE,
  RANDOM_CHOICE,
  SHOW_WINNER,
}

export type StepAddMovies = {
  type: StepType.ADD_MOVIES;
  movies: Movie[];
};
export type StepStartTournament = {
  type: StepType.START_TOURNAMENT;
  movies: Movie[];
};
export type StepViewersChoice = {
  type: StepType.VIEWERS_CHOICE;
  movies: Movie[];
};
export type StepStreamerChoice = {
  type: StepType.STREAMER_CHOICE;
  movies: Movie[];
};
export type StepRandomChoice = {
  type: StepType.RANDOM_CHOICE;
  movies: Movie[];
};
export type StepShowWinner = {
  type: StepType.SHOW_WINNER;
  movies: Movie[];
};

export type Step =
  | StepAddMovies
  | StepStartTournament
  | StepViewersChoice
  | StepStreamerChoice
  | StepRandomChoice
  | StepShowWinner;

export type CardSize = "small" | "medium" | "large";

export type Permissions = Record<
  | TwitchUserType.Mod
  | TwitchUserType.Vip
  | TwitchUserType.Sub
  | TwitchUserType.Viewer,
  boolean
>;
