import { Fragment } from 'react';
import TwitchBadge from 'components/TwitchBadge';

export type Badge = {
  title: string;
  name: string;
  version?: string;
};

type Props = {
  badges: Badge[];
  channelId?: string;
};

const UserBadges = ({ badges, channelId }: Props) => (
  <>
    {badges.map(({ title, name, version }) => (
      <Fragment key={name}>
        <TwitchBadge name={name} version={version} channelId={channelId}>
          {title}
        </TwitchBadge>{' '}
      </Fragment>
    ))}
  </>
);

export default UserBadges;
