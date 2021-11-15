import { createSelector, EntityState } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import { api } from "./apiSlice";
import { Vote, Voting, VotingOption } from "./apiTypes";

// TODO: fix types
const votingSelector = (state: AppState, votingId: number) =>
  state.api.queries[`voting(${votingId})`] as { data?: Voting };

const votingOptionsSelector = (state: AppState, votingId: number) =>
  state.api.queries[`votingOptions(${votingId})`] as {
    data?: EntityState<VotingOption>;
  };

const votesSelector = (state: AppState, votingId: number) =>
  state.api.queries[`votes(${votingId})`] as { data?: EntityState<Vote> };

// const votingSelector = (state: AppState, votingId: number) =>
//   api.endpoints.voting.select(votingId)(state);

// const votingOptionsSelector = (state: AppState, votingId: number) =>
//   api.endpoints.votingOptions.select(votingId)(state);

// const votesSelector = (state: AppState, votingId: number) =>
//   api.endpoints.votes.select(votingId)(state);

const meSelector = api.endpoints.me.select();

const getFullVoteValues = (votes: EntityState<Vote>) =>
  votes.ids.reduce((acc, id) => {
    const vote = votes.entities[id];

    return {
      ...acc,
      [vote.votingOptionId]: (acc[vote.votingOptionId] || 0) + 1,
    };
  }, {});

export const renderedVotingOptionsSelector = createSelector(
  votingSelector,
  votingOptionsSelector,
  votesSelector,
  meSelector,
  (voting, votingOptions, votes, me) => {
    if (!voting || !votingOptions || !votes || !me) return [];
    if (!voting.data || !votingOptions.data) return [];
    if (voting.data.showValues && !votes.data) return [];

    let fullVoteValues: Record<number, number> = {};

    if (voting.data.showValues) {
      fullVoteValues = getFullVoteValues(votes.data);
    }

    const result = votingOptions.data.ids.map((id) => {
      const votingOption = votingOptions.data.entities[id];
      const isActive =
        votes.data?.entities[me.data?.id]?.votingOptionId === votingOption.id;
      const fullVotesValue = voting.data?.showValues
        ? fullVoteValues[votingOption.id]
        : "-";

      return {
        votingOption,
        isActive,
        fullVotesValue,
      };
    });

    if (voting.data.showValues) {
      result.sort(
        (a, b) =>
          (fullVoteValues[b.votingOption.id] || 0) -
          (fullVoteValues[a.votingOption.id] || 0)
      );
    }

    return result;
  }
);
