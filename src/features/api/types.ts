import { components } from "./types.generated";

export type User = components["schemas"]["User"];
export type UserRoles = components["schemas"]["UserRoles"];

export type RefreshTokenResponse =
  components["schemas"]["RefreshTokenResponse"];

export type Voting = components["schemas"]["Voting"];
export type CreateVotingDto = components["schemas"]["CreateVotingDto"];
export type UpdateVotingDto = components["schemas"]["UpdateVotingDto"];

export type VotingOption = components["schemas"]["VotingOption"];
export type VotingOptionWithAuthor = VotingOption & { author: User };
export type CreateVotingOptionDto =
  components["schemas"]["CreateVotingOptionDto"];
export type VotingPermissions = components["schemas"]["VotingPermissions"];

export type Vote = components["schemas"]["Vote"];
export type CreateVoteDto = components["schemas"]["CreateVoteDto"];
export type DeleteVoteDto = components["schemas"]["DeleteVoteDto"];

export type ChatVoting = components["schemas"]["ChatVoting"];
export type CreateChatVotingDto = components["schemas"]["CreateChatVotingDto"];
export type UpdateChatVotingDto = components["schemas"]["UpdateChatVotingDto"];

export type ChatVote = components["schemas"]["ChatVote"];

export type ChatGoal = components["schemas"]["ChatGoal"];
export type ChatGoalEvent = components["schemas"]["ChatGoalEvent"];
export type CreateChatGoalDto = components["schemas"]["CreateChatGoalDto"];
export type UpdateChatGoalDto = components["schemas"]["UpdateChatGoalDto"];

export enum TwitchUserType {
  Broadcaster = "broadcaster",
  Editor = "editor",
  Mod = "mod",
  Vip = "vip",
  Sub = "sub",
  SubTier1 = "subTier1",
  SubTier2 = "subTier2",
  SubTier3 = "subTier3",
  Follower = "follower",
  Viewer = "viewer",
}

export enum SubTier {
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
}

export enum VotingOptionType {
  KinopoiskMovie = "kinopoiskMovie",
  IgdbGame = "igdbGame",
  Custom = "custom",
}

export enum GoalStatus {
  Uninitialized,

  TimerIdle,
  TimerRunning,
  TimerPaused,

  VotingIdle,
  VotingRunning,
  VotingPaused,
  VotingFinished,
}

/** @deprecated */
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
