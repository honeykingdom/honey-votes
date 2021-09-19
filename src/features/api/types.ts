import { components } from "./types.generated";

export type User = components["schemas"]["User"];

export type Voting = components["schemas"]["Voting"];
export type AddVotingDto = components["schemas"]["AddVotingDto"];
export type UpdateVotingDto = components["schemas"]["UpdateVotingDto"];

export type VotingOption = components["schemas"]["VotingOption"];
export type AddVotingOptionDto = components["schemas"]["AddVotingOptionDto"];

export type AddVoteDto = components["schemas"]["AddVoteDto"];

export enum TwitchUserType {
  Admin = "admin",
  Editor = "editor",
  Mod = "mod",
  Vip = "vip",
  SubTier1 = "subTier1",
  SubTier2 = "subTier2",
  SubTier3 = "subTier3",
  Follower = "follower",
  Viewer = "viewer",
}

export enum SubTier {
  t1 = "1000",
  t2 = "2000",
  t3 = "3000",
}

export enum VotingOptionType {
  KinopoiskMovie = "kinopoiskMovie",
  IgdbGame = "igdbGame",
  Custom = "custom",
}

export type Streamer = {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
};
