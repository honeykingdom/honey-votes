import PollIcon from '@mui/icons-material/Poll';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { BroadcasterType } from 'features/api/apiConstants';
import { User } from 'features/api/apiTypes';

const ADMINS = process.env.NEXT_PUBLIC_ADMINS!.split(';');

const getMainMenuLinks = (user: Pick<User, 'login' | 'broadcasterType'>) => {
  if (!user) return [];

  const isPartner = user.broadcasterType !== BroadcasterType.None;
  const isAdmin = ADMINS.includes(user.login);

  if (!isPartner && !isAdmin) return [];

  return [
    {
      name: 'voting',
      href: `/${user.login}/voting`,
      IconComponent: PollIcon,
    },
    {
      name: 'chatVoting',
      href: `/${user.login}/chat-voting`,
      IconComponent: PollIcon,
    },
    {
      name: 'chatGoal',
      href: `/${user.login}/chat-goal`,
      IconComponent: ThumbsUpDownIcon,
    },
  ];
};

export default getMainMenuLinks;
