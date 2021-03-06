import { Box } from '@mui/material';
import TwitchBadge from './TwitchBadge';

type Props = {
  channelId?: string;
  userName: string;
  // TODO: add types
  tags: any;
};

const TwitchNickName = ({ channelId, userName, tags }: Props) => {
  // TODO: don't display chinese nicknames
  const nickName = tags.displayName || userName;
  const badges = Object.entries(tags.badges || {}).map(
    ([name, version]: [string, any]) => (
      <TwitchBadge
        key={name}
        channelId={channelId}
        name={name}
        version={version === true ? '1' : version}
      />
    ),
  );

  return (
    <Box component="span" sx={{ fontWeight: 'bold', color: tags.color }}>
      {badges}
      {nickName}
    </Box>
  );
};

export default TwitchNickName;
