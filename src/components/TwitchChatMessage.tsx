import { Box } from '@mui/material';

type Props = {
  message: string;
  tags: any;
};

const TwitchChatMessage = ({ message, tags }: Props) => <Box>{message}</Box>;

export default TwitchChatMessage;
