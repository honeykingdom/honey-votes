import { Fragment } from "react";
import TwitchBadge from "components/TwitchBadge";

export type Badge = { title: string; name: string };

type Props = {
  badges: Badge[];
  channelId?: string;
};

const UserBadges = ({ badges, channelId }: Props) => (
  <>
    {badges.map(({ title, name }) => (
      <Fragment key={name}>
        <TwitchBadge name={name} channelId={channelId}>
          {title}
        </TwitchBadge>{" "}
      </Fragment>
    ))}
  </>
);

export default UserBadges;
