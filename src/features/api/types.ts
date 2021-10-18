import { components } from "./types.generated";

export type User = components["schemas"]["User"];
export type UserRoles = components["schemas"]["UserRoles"];

export type RefreshTokenResponse =
  components["schemas"]["RefreshTokenResponse"];

export type Voting = components["schemas"]["Voting"];
export type AddVotingDto = components["schemas"]["AddVotingDto"];
export type UpdateVotingDto = components["schemas"]["UpdateVotingDto"];

export type VotingOption = components["schemas"]["VotingOption"];
export type AddVotingOptionDto = components["schemas"]["AddVotingOptionDto"];

export type AddVoteDto = components["schemas"]["AddVoteDto"];

export type ChatVoting = components["schemas"]["ChatVoting"];
export type AddChatVotingDto = components["schemas"]["AddChatVotingDto"];
export type UpdateChatVotingDto = components["schemas"]["UpdateChatVotingDto"];

export type ChatVote = components["schemas"]["ChatVote"];

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

export type Jwt = {
  sub: string;
  login: string;
  iat: number;
  exp: number;
};
