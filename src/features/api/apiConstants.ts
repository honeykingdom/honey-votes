export const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/honey-votes`;
export const API_BASE_POSTGREST = `${process.env.NEXT_PUBLIC_SUPABASE_HOST}/rest/v1`;

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;
export const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export const USER_TABLE_NAME = "hv_user";

export const CHAT_VOTING_TABLE_NAME = "hv_chat_voting";
export const CHAT_VOTE_TABLE_NAME = "hv_chat_vote";

export const VOTE_TABLE_NAME = "hv_vote";
export const VOTING_TABLE_NAME = "hv_voting";
export const VOTING_OPTION_TABLE_NAME = "hv_voting_option";

export const CHAT_GOAL_TABLE_NAME = "hv_chat_goal";
export const CHAT_GOAL_EVENT_TABLE_NAME = "hv_chat_goal_event";

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

export enum ChatGoalStatus {
  Uninitialized,

  TimerIdle,
  TimerRunning,
  TimerPaused,

  VotingIdle,
  VotingRunning,
  VotingPaused,
  VotingFinished,
}

export enum ChatEventType {
  Upvote = "upvote",
  Downvote = "downvote",
}
