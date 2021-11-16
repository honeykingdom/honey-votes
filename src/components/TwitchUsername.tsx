import { Avatar, Box } from "@mui/material";

type Props = {
  username: string;
  avatarUrl?: string;
};

const TwitchUsername = ({ username = "", avatarUrl }: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar src={avatarUrl} sx={{ mr: 1, width: 24, height: 24 }}>
        {username[0]?.toUpperCase()}
      </Avatar>{" "}
      {username}
    </Box>
  );
};

export default TwitchUsername;
