import { Typography } from "@mui/material";
import globalBadges from "features/twitch-api/globalBadges.mock.json";

type Props = {
  name: string;
  version?: string;
  children?: React.ReactNode;
};

const TwitchBadge = ({ name, version = "1", children }: Props) => {
  const badge = globalBadges.badge_sets[name].versions[version];

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
