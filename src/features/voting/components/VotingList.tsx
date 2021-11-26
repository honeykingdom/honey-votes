import { Grid } from '@mui/material';
import { Voting } from 'features/api/apiTypes';
import VotingCard from './VotingCard';

type Props = {
  canManage: boolean;
  votingList: Voting[];
  channelLogin: string;
};

const VotingList = ({ canManage, votingList, channelLogin }: Props) => {
  return (
    <Grid container>
      {votingList.map((voting) => (
        <Grid item sx={{ mb: 2 }} width="100%" key={voting.id}>
          <VotingCard
            voting={voting}
            canManage={canManage}
            href={`/${channelLogin}/voting/${voting.id}`}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VotingList;
