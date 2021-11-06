import { User, UserRoles, Voting, VotingOption } from "features/api/types";
import getIsVotingOwner from "./getIsVotingOwner";

const getCanCreateVotingOptions = (
  voting?: Voting,
  votingOptions?: VotingOption[],
  me?: User,
  meRoles?: UserRoles
) => {
  if (!voting || !me) return false;

  if (getIsVotingOwner(voting, me)) return true;

  if (!meRoles) return false;

  if (meRoles.isEditor) return true;

  if (!voting.canManageVotingOptions) return false;

  if (!votingOptions) return false;
  if (votingOptions.length >= voting.votingOptionsLimit) return false;

  const votingOptionsByUser = votingOptions.filter(
    (votingOption) => votingOption.authorId === me.id
  );

  if (votingOptionsByUser.length >= 1) return false;

  if (voting.permissions.viewer.canAddOptions) return true;

  if (voting.permissions.mod.canAddOptions && meRoles.isMod) return true;
  if (voting.permissions.vip.canAddOptions && meRoles.isVip) return true;
  if (
    voting.permissions.sub.canAddOptions &&
    meRoles.isSub &&
    meRoles.subTier >= voting.permissions.sub.subTierRequiredToAddOptions
  ) {
    return true;
  }
  if (
    voting.permissions.follower.canAddOptions &&
    meRoles.isFollower &&
    meRoles.minutesFollowed >=
      voting.permissions.follower.minutesToFollowRequiredToAddOptions
  ) {
    return true;
  }

  return false;
};

export default getCanCreateVotingOptions;
