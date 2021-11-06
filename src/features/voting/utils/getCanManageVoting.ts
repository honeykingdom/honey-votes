import { User, UserRoles, Voting } from "features/api/types";
import getIsVotingOwner from "./getIsVotingOwner";

const getCanManageVoting = (
  voting?: Voting,
  me?: User,
  meRoles?: UserRoles
) => {
  if (!voting || !me) return false;

  if (getIsVotingOwner(voting, me)) return true;

  if (!meRoles) return false;

  if (meRoles.isEditor) return true;

  return false;
};

export default getCanManageVoting;
