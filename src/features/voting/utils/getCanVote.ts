import { User, UserRoles, Voting } from "features/api/types";

const getCanVote = (voting?: Voting, me?: User, meRoles?: UserRoles) => {
  if (!voting || !me) return false;

  if (!voting.canManageVotes) return false;
  if (voting.permissions.viewer.canVote) return true;
  if (!meRoles) return false;

  if (voting.permissions.mod.canVote && meRoles.isMod) return true;
  if (voting.permissions.vip.canVote && meRoles.isVip) return true;
  if (
    voting.permissions.sub.canVote &&
    meRoles.isSub &&
    meRoles.subTier >= voting.permissions.sub.subTierRequiredToVote
  ) {
    return true;
  }
  if (
    voting.permissions.follower.canVote &&
    meRoles.isFollower &&
    meRoles.minutesFollowed >=
      voting.permissions.follower.minutesToFollowRequiredToVote
  ) {
    return true;
  }

  return false;
};

export default getCanVote;
