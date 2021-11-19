import { components } from "./apiTypes.generated";

export type User = components["schemas"]["User"];
export type UserRoles = components["schemas"]["UserRoles"];

export type RefreshTokenResponse =
  components["schemas"]["RefreshTokenResponse"];

export type Voting = components["schemas"]["Voting"];
export type CreateVotingDto = components["schemas"]["CreateVotingDto"];
export type UpdateVotingDto = components["schemas"]["UpdateVotingDto"];

export type VotingOption = components["schemas"]["VotingOption"];
export type CreateVotingOptionDto =
  components["schemas"]["CreateVotingOptionDto"];
export type VotingPermissions = components["schemas"]["VotingPermissions"];

export type Vote = Omit<
  components["schemas"]["Vote"],
  "createdAt" | "updatedAt"
>;
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

export type Jwt = {
  sub: string;
  login: string;
  iat: number;
  exp: number;
};
