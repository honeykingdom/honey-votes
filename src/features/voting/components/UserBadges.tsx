import { Fragment } from "react";
import TwitchBadge from "components/TwitchBadge";

export type Badge = { title: string; name: string };

type Props = {
  badges: Badge[];
};

const UserBadges = ({ badges }: Props) => (
  <>
    {badges.map(({ title, name }) => (
      <Fragment key={name}>
        <TwitchBadge name={name}>{title}</TwitchBadge>{" "}
      </Fragment>
    ))}
  </>
);

export default UserBadges;
