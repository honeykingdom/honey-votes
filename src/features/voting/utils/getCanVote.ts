import { User, UserRoles, Voting } from "features/api/types";

const getCanVote = (voting?: Voting, me?: User, meRoles?: UserRoles) => {
  if (!voting || !me) return false;

  if (!voting.canManageVotes) return false;
  if (voting.permissions.viewer.canVote) return true;
  if (!meRoles) return false;

  if (voting.permissions.mod.canVote && meRoles.mod) return true;
  if (voting.permissions.vip.canVote && meRoles.vip) return true;
  if (
    voting.permissions.sub.canVote &&
    meRoles.sub &&
    meRoles.subTier >= voting.permissions.sub.subTierRequiredToVote
  ) {
    return true;
  }
  if (
    voting.permissions.follower.canVote &&
    meRoles.follower &&
    meRoles.minutesFollowed >=
      voting.permissions.follower.minutesToFollowRequiredToVote
  ) {
    return true;
  }

  return false;
};

export default getCanVote;
