import { User, Voting } from 'features/api/apiTypes';

const getIsVotingOwner = (voting?: Voting, me?: User) => {
  if (!voting || !me) return false;

  return voting.broadcasterId === me.id;
};

export default getIsVotingOwner;
