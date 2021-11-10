import { Typography } from "@mui/material";
import {
  useChannelBadgesQuery,
  useGlobalBadgesQuery,
} from "features/twitch-api/twitchApiSlice";

type Props = {
  channelId?: string;
  name: string;
  version?: string;
  children?: React.ReactNode;
};

const TwitchBadge = ({ channelId, name, version = "1", children }: Props) => {
  const globalBadges = useGlobalBadgesQuery();
  const channelBadges = useChannelBadgesQuery(channelId, { skip: !channelId });

  const badge =
    globalBadges.data?.[name]?.versions?.[version] ||
    channelBadges.data?.[name]?.versions?.[version];

  if (!badge) return null;

  return (
    <Typography variant="inherit" color="inherit" component="span">
      <img
        src={badge.image_url_1x}
        srcSet={`${badge.image_url_2x} 2x, ${badge.image_url_4x} 4x`}
        alt={name}
        style={{ marginRight: 4, verticalAlign: "middle" }}
      />
      {children}
    </Typography>
  );
};

export default TwitchBadge;
