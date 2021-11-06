import { User, Voting } from "features/api/types";

const getIsVotingOwner = (voting?: Voting, me?: User) => {
  if (!voting || !me) return false;

  return voting.broadcasterId === me.id;
};

export default getIsVotingOwner;
