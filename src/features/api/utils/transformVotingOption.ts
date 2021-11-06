import { User, VotingOption, VotingOptionWithAuthor } from "../types";

type VotingOptionResponse = Omit<VotingOption, "authorId"> & {
  authorId: User;
};

const transformVotingOption = (
  votingOption: VotingOption
): VotingOptionWithAuthor => {
  const { authorId, ...rest } = votingOption as unknown as VotingOptionResponse;

  return {
    author: authorId,
    authorId: authorId.id,
    ...rest,
  };
};

export default transformVotingOption;
