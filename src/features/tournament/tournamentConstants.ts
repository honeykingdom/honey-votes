import { TwitchUserType } from 'features/api/apiConstants';
import { CardSize, Permissions } from './tournamentTypes';

export const CARD_HEIGHT_MAP: Record<CardSize, number> = {
  small: 48,
  medium: 64,
  large: 80,
};

export const CARD_IMAGE_WIDTH_MAP: Record<CardSize, number> = {
  small: CARD_HEIGHT_MAP.small * (3 / 4),
  medium: CARD_HEIGHT_MAP.medium * (3 / 4),
  large: CARD_HEIGHT_MAP.large * (3 / 4),
};

export const NO_POSTER_URL = 'https://st.kp.yandex.net/images/no-poster.gif';

export const DEFAULT_PERMISSIONS: Permissions = {
  [TwitchUserType.Mod]: true,
  [TwitchUserType.Vip]: true,
  [TwitchUserType.Sub]: true,
  [TwitchUserType.Viewer]: true,
};

export const USER_TYPES: {
  label: string;
  name:
    | TwitchUserType.Mod
    | TwitchUserType.Vip
    | TwitchUserType.Sub
    | TwitchUserType.Viewer;
}[] = [
  { label: 'Модеры', name: TwitchUserType.Mod },
  { label: 'Випы', name: TwitchUserType.Vip },
  { label: 'Сабы', name: TwitchUserType.Sub },
  { label: 'Зрители', name: TwitchUserType.Viewer },
];

export const WHEEL_COLORS = {
  wheelBackground: '#212121',
  text: '#fff',
  border: '#fff',
};
