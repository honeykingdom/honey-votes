import {
  SubTier,
  TwitchUserType,
  VotingOptionType,
} from 'features/api/apiConstants';

export enum FollowedTime {
  None = 0,
  TenMinutes = 10,
  ThirtyMinutes = 30,
  OneHour = 60,
  OneDay = 60 * 24,
  OneWeek = 60 * 24 * 7,
  OneMonth = 60 * 24 * 30,
  ThreeMonths = 60 * 24 * 30 * 3,
}

export const SUB_TIERS = [SubTier.Tier1, SubTier.Tier2, SubTier.Tier3];

export const FOLLOWED_TIME_VALUES = [
  FollowedTime.None,
  FollowedTime.TenMinutes,
  FollowedTime.ThirtyMinutes,
  FollowedTime.OneHour,
  FollowedTime.OneDay,
  FollowedTime.OneWeek,
  FollowedTime.OneMonth,
  FollowedTime.ThreeMonths,
];

export const VOTING_OPTION_TYPES = [
  VotingOptionType.Custom,
  VotingOptionType.KinopoiskMovie,
  VotingOptionType.IgdbGame,
] as const;

export const USER_TYPES = [
  TwitchUserType.Mod,
  // TwitchUserType.Vip,
  TwitchUserType.Sub,
  TwitchUserType.Follower,
  TwitchUserType.Viewer,
] as const;

export const SWITCHES = [
  'canManageVotes',
  'canManageVotingOptions',
  'showValues',
] as const;
