import { VotingOption } from "../apiTypes";

type VotingOptionResponse = Omit<VotingOption, "authorId"> & {
  authorId: VotingOption["authorData"] & { id: VotingOption["authorId"] };
};

const transformVotingOption = (votingOption: VotingOption): VotingOption => {
  const {
    authorId: { id: authorId, ...authorData },
    authorData: _,
    ...rest
  } = votingOption as unknown as VotingOptionResponse;

  return {
    authorData,
    authorId,
    ...rest,
  };
};

export default transformVotingOption;
