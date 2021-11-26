import { User, UserRoles, Voting, VotingOption } from 'features/api/apiTypes';
import getIsVotingOwner from './getIsVotingOwner';

const getCanCreateVotingOptions = (
  voting?: Voting,
  votingOptions?: { votingOption: VotingOption }[],
  me?: User,
  meRoles?: UserRoles,
): [boolean] | [boolean, string] => {
  if (!voting || !me) return [false];

  if (getIsVotingOwner(voting, me)) return [true];

  if (!meRoles) return [false];

  if (meRoles.editor) return [true];

  if (!voting.canManageVotingOptions) return [false];

  if (!votingOptions) return [false];
  if (votingOptions.length >= voting.votingOptionsLimit) {
    return [false, 'Достигнут лимит количества вариантов для голосования.'];
  }

  const votingOptionsByUser = votingOptions.filter(
    (votingOption) => votingOption.votingOption.authorId === me.id,
  );

  if (votingOptionsByUser.length >= 1) {
    return [false, 'Вы уже добавили вариант для голосования.'];
  }

  if (voting.permissions.viewer.canAddOptions) return [true];

  if (voting.permissions.mod.canAddOptions && meRoles.mod) return [true];
  if (voting.permissions.vip.canAddOptions && meRoles.vip) return [true];
  if (
    voting.permissions.sub.canAddOptions &&
    meRoles.sub &&
    meRoles.subTier >= voting.permissions.sub.subTierRequiredToAddOptions
  ) {
    return [true];
  }
  if (
    voting.permissions.follower.canAddOptions &&
    meRoles.follower &&
    meRoles.minutesFollowed >=
      voting.permissions.follower.minutesToFollowRequiredToAddOptions
  ) {
    return [true];
  }

  return [false];
};

export default getCanCreateVotingOptions;
