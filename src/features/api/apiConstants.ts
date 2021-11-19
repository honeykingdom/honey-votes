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

export enum ChatGoalEventType {
  Upvote = "upvote",
  Downvote = "downvote",
}

export enum BroadcasterType {
  None = "",
  Partner = "partner",
  Affiliate = "affiliate",
}

export enum HoneyError {
  VotingNoPermission = "VotingNoPermission",
  // TODO:
  VotingCreateLimitReached = "VotingCreateLimitReached",

  VotingOptionCreateDisabled = "VotingOptionCreateDisabled",
  VotingOptionCreateLimitReached = "VotingOptionCreateLimitReached",
  VotingOptionCreateAlreadyCreatedByUser = "VotingOptionCreateAlreadyCreatedByUser",
  VotingOptionCreateNoPermission = "VotingOptionCreateNoPermission",
  VotingOptionCreateAlreadyExists = "VotingOptionCreateAlreadyExists",
  VotingOptionCreateKinopoiskMovieNotFound = "VotingOptionCreateKinopoiskMovieNotFound",
  VotingOptionCantIgdbGameNotFound = "VotingOptionCantIgdbGameNotFound",

  VotingOptionDeleteDisabled = "VotingOptionDeleteDisabled",
  VotingOptionDeleteNotOwner = "VotingOptionDeleteNotOwner",
  VotingOptionDeleteHasVotes = "VotingOptionDeleteHasVotes",

  VoteCreateDisabled = "VoteCreateDisabled",
  VoteCreateTooQuickly = "VoteCreateTooQuickly",
  VoteCreateNoPermission = "VoteCreateNoPermission",

  VoteDeleteDisabled = "VoteDeleteDisabled",
  VoteDeleteNotOwner = "VoteDeleteNotOwner",
  VoteDeleteTooQuickly = "VoteDeleteTooQuickly",
}

// prettier-ignore
export const API_ERRORS: Record<HoneyError, string> = {
  [HoneyError.VotingNoPermission]: 'У вас недостаточно прав чтобы создать голосование.',
  // TODO:
  [HoneyError.VotingCreateLimitReached]: '',

  [HoneyError.VotingOptionCreateDisabled]: 'Добавление/удаление вариантов для голосования отключено',
  [HoneyError.VotingOptionCreateLimitReached]: 'Достигнут лимит вариантов для голосования',
  [HoneyError.VotingOptionCreateAlreadyCreatedByUser]: 'Вы уже добавили вариант для голосования',
  [HoneyError.VotingOptionCreateNoPermission]: 'У вас недостаточно прав чтобы добавить вариант для голосования',
  [HoneyError.VotingOptionCreateAlreadyExists]: 'Такой вариант уже существует',
  [HoneyError.VotingOptionCreateKinopoiskMovieNotFound]: 'Не удалось найти такой фильм на kinopoisk.ru',
  [HoneyError.VotingOptionCantIgdbGameNotFound]: 'Не удалось найти такую игру на IGDB.com',

  [HoneyError.VotingOptionDeleteDisabled]: 'Добавление/удаление вариантов для голосования отключено',
  [HoneyError.VotingOptionDeleteNotOwner]: 'Вы пытаетесь удалить чужой вариант для голосования',
  [HoneyError.VotingOptionDeleteHasVotes]: 'Невозможно удалить вариант для голосования, за который уже кто-то проголосовал',

  [HoneyError.VoteCreateDisabled]: 'Голосование отключено',
  [HoneyError.VoteCreateTooQuickly]: 'Вы голосуете слишком быстро',
  [HoneyError.VoteCreateNoPermission]: 'У вас недостаточно прав чтобы голосовать',

  [HoneyError.VoteDeleteDisabled]: 'Голосование отключено',
  [HoneyError.VoteDeleteNotOwner]: 'Вы пытаетесь удалить чужой голоса',
  [HoneyError.VoteDeleteTooQuickly]: 'Вы голосуете слишком быстро',
}
