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

export const SUB_TIERS = [
  { value: SubTier.Tier1, label: 'Тир 1' },
  { value: SubTier.Tier2, label: 'Тир 2' },
  { value: SubTier.Tier3, label: 'Тир 3' },
];

export const FOLLOWED_TIME_VALUES = [
  { value: FollowedTime.None, label: 'Нет' },
  { value: FollowedTime.TenMinutes, label: '10 минут' },
  { value: FollowedTime.ThirtyMinutes, label: '30 минут' },
  { value: FollowedTime.OneHour, label: '1 час' },
  { value: FollowedTime.OneDay, label: '1 день' },
  { value: FollowedTime.OneWeek, label: '1 неделя' },
  { value: FollowedTime.OneMonth, label: '1 месяц' },
  { value: FollowedTime.ThreeMonths, label: '3 месяца' },
];

export const VOTING_OPTION_TYPES = [
  {
    label: 'Пользовательские варианты',
    description: 'Пользователи могут ввести свой текст',
    name: VotingOptionType.Custom,
  },
  {
    label: 'Фильмы (kinopoisk.ru)',
    description: 'Пользователи могут предложить фильм из сайта kinopoisk.ru',
    name: VotingOptionType.KinopoiskMovie,
  },
  {
    label: 'Игры (IGDB.com)',
    description: 'Пользователи могут предложить игру из базы IGDB.com',
    name: VotingOptionType.IgdbGame,
  },
] as const;

export const USER_TYPES_ITEMS = [
  { label: 'Модеры', type: TwitchUserType.Mod },
  // { label: "Випы", type: TwitchUserType.Vip },
  { label: 'Сабы', type: TwitchUserType.Sub },
  { label: 'Фолловеры', type: TwitchUserType.Follower },
  { label: 'Зрители', type: TwitchUserType.Viewer },
] as const;
