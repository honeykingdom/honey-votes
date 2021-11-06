import { User, UserRoles, Voting, VotingOption } from "features/api/types";
import getIsVotingOwner from "./getIsVotingOwner";

const getCanDeleteVotingOption = (
  voting?: Voting,
  votingOption?: VotingOption,
  me?: User,
  meRoles?: UserRoles,
  votingOptionsCount?: number
) => {
  if (!voting || !me) return false;

  if (getIsVotingOwner(voting, me)) return true;

  if (!meRoles) return false;
  if (meRoles.isEditor) return true;
  if (!voting.canManageVotingOptions) return false;
  if (!votingOption) return false;

  return me.id === votingOption.authorId && votingOptionsCount === 0;
};

export default getCanDeleteVotingOption;
