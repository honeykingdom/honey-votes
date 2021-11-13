import { User, VotingOption } from "features/api/apiTypes";

const getIsVotingOptionOwner = (votingOption?: VotingOption, me?: User) => {
  if (!votingOption || !me) return false;

  return votingOption.authorId === me.id;
};

export default getIsVotingOptionOwner;
