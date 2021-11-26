import { Typography } from '@mui/material';
import {
  useChannelBadgesQuery,
  useGlobalBadgesQuery,
} from 'features/twitch-api/twitchApiSlice';
import { BadgeSets } from 'features/twitch-api/twitchApiTypes';

const getBadge = (
  name: string,
  version: string | number,
  globalBadges?: BadgeSets,
  channelBadges?: BadgeSets,
) =>
  channelBadges?.[name]?.versions?.[version] ||
  globalBadges?.[name]?.versions?.[version];

type Props = {
  channelId?: string;
  name: string;
  version?: string | number;
  children?: React.ReactNode;
};

const TwitchBadge = ({ channelId, name, version = '1', children }: Props) => {
  const globalBadges = useGlobalBadgesQuery();
  const channelBadges = useChannelBadgesQuery(channelId, { skip: !channelId });

  let badge = getBadge(name, version, globalBadges.data, channelBadges.data);

  if (!badge && name === 'subscriber') {
    badge = getBadge(name, '0', globalBadges.data, channelBadges.data);
  }

  if (!badge) return null;

  return (
    <Typography variant="inherit" color="inherit" component="span">
      <img
        src={badge.image_url_1x}
        srcSet={`${badge.image_url_2x} 2x, ${badge.image_url_4x} 4x`}
        alt={name}
        style={{ marginRight: 4, verticalAlign: 'middle' }}
      />
      {children}
    </Typography>
  );
};

export default TwitchBadge;
