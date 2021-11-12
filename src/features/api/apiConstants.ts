import {
  VotingPermissions,
  VotingOptionType,
  ChatGoal,
  ChatGoalStatus,
  ChatGoalOptions,
  ChatGoalState,
} from "./types";
import apiSchemas from "./api-schemas.json";

export const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/honey-votes`;
export const API_BASE_POSTGREST = `${process.env.NEXT_PUBLIC_SUPABASE_HOST}/rest/v1`;

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;
export const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const TWITCH_MESSAGE_MAX_LENGTH = 500;

export const USER_TABLE_NAME = "hv_user";

export const CHAT_VOTING_TABLE_NAME = "hv_chat_voting";
export const CHAT_VOTE_TABLE_NAME = "hv_chat_vote";

export const VOTE_TABLE_NAME = "hv_vote";
export const VOTING_TABLE_NAME = "hv_voting";
export const VOTING_OPTION_TABLE_NAME = "hv_voting_option";

export const CHAT_GOAL_TABLE_NAME = "hv_chat_goal";
export const CHAT_GOAL_EVENT_TABLE_NAME = "hv_chat_goal_event";

// voting
export const VOTING_TITLE_MAX_LENGTH = 50;
export const VOTING_DESCRIPTION_MAX_LENGTH = 255;

export const VOTING_OPTIONS_LIMIT_MIN = 2;
export const VOTING_OPTIONS_LIMIT_MAX = 200;

export const VOTING_CAN_MANAGE_VOTES_DEFAULT = true;
export const VOTING_CAN_MANAGE_VOTING_OPTIONS_DEFAULT = true;
export const VOTING_PERMISSIONS_DEFAULT: VotingPermissions =
  apiSchemas.Voting.properties.permissions.default;
export const VOTING_ALLOWED_VOTING_OPTIONS_TYPES_DEFAULT: VotingOptionType[] = [
  VotingOptionType.KinopoiskMovie,
  VotingOptionType.IgdbGame,
  VotingOptionType.Custom,
];
export const VOTING_OPTIONS_LIMIT_DEFAULT = 100;

// voting option
export const VOTING_OPTION_CARD_TITLE_MAX_LENGTH = 50;
export const VOTING_OPTION_CARD_SUBTITLE_MAX_LENGTH = 255;
export const VOTING_OPTION_CARD_DESCRIPTION_MAX_LENGTH = 255;

// chat goal
export const CHAT_GOAL_TITLE_MAX_LENGTH = 50;

export const CHAT_GOAL_UPVOTE_COMMAND_DEFAULT = "VoteYea";
export const CHAT_GOAL_DOWNVOTE_COMMAND_DEFAULT = "VoteNay";
export const CHAT_GOAL_VOTE_COMMAND_MAX_LENGTH = TWITCH_MESSAGE_MAX_LENGTH;

export const CHAT_VOTES_MAX_VOTES_VALUE_DEFAULT = 100;

export const CHAT_GOAL_PERMISSIONS_DEFAULT: ChatGoal["permissions"] =
  apiSchemas.ChatGoal.properties.permissions.default;

export const CHAT_GOAL_OPTIONS_DEFAULT: ChatGoalOptions = {
  permissions: CHAT_GOAL_PERMISSIONS_DEFAULT,
  listening: false,
  title: "",
  upvoteCommand: CHAT_GOAL_UPVOTE_COMMAND_DEFAULT,
  downvoteCommand: CHAT_GOAL_DOWNVOTE_COMMAND_DEFAULT,
  timerDuration: 0,
  maxVotesValue: CHAT_VOTES_MAX_VOTES_VALUE_DEFAULT,
};

export const CHAT_GOAL_STATE_DEFAULT: ChatGoalState = {
  status: ChatGoalStatus.Uninitialized,
  endTimerTimestamp: 0,
  remainingTimerDuration: 0,
  votesValue: 0,
};

export const CHAT_GOAL_DEFAULT: Partial<ChatGoal> = {
  ...CHAT_GOAL_OPTIONS_DEFAULT,
  ...CHAT_GOAL_STATE_DEFAULT,
};
