import {
  TwitchUserType,
  VotingPermissions,
  VotingOptionType,
  SubTier,
} from "./types";

export const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/honey-votes`;
export const API_BASE_POSTGREST = `${process.env.NEXT_PUBLIC_SUPABASE_HOST}/rest/v1`;

export const USER_TABLE_NAME = "hv_user";

export const CHAT_VOTING_TABLE_NAME = "hv_chat_voting";
export const CHAT_VOTE_TABLE_NAME = "hv_chat_vote";

export const VOTE_TABLE_NAME = "hv_vote";
export const VOTING_TABLE_NAME = "hv_voting";
export const VOTING_OPTION_TABLE_NAME = "hv_voting_option";

// voting
export const VOTING_TITLE_MAX_LENGTH = 50;
export const VOTING_DESCRIPTION_MAX_LENGTH = 255;

export const VOTING_OPTIONS_LIMIT_MIN = 2;
export const VOTING_OPTIONS_LIMIT_MAX = 200;

export const VOTING_CAN_MANAGE_VOTES_DEFAULT = true;
export const VOTING_CAN_MANAGE_VOTING_OPTIONS_DEFAULT = true;
export const VOTING_USER_TYPES_PARAMS_DEFAULT: VotingPermissions = {
  [TwitchUserType.Mod]: { canVote: true, canAddOptions: true },
  [TwitchUserType.Vip]: { canVote: true, canAddOptions: true },
  [TwitchUserType.Sub]: {
    canVote: true,
    canAddOptions: true,
    subTierRequiredToVote: SubTier.Tier1,
    subTierRequiredToAddOptions: SubTier.Tier1,
  },
  [TwitchUserType.Follower]: {
    canVote: false,
    canAddOptions: false,
    minutesToFollowRequiredToVote: 0,
    minutesToFollowRequiredToAddOptions: 0,
  },
  [TwitchUserType.Viewer]: { canVote: false, canAddOptions: false },
};
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
