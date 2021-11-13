import type {
  ChatGoal,
  ChatGoalEvent,
} from "../../../src/features/api/apiTypes";

export type Goal = ChatGoal;
export type GoalEvent = ChatGoalEvent;

export enum GoalEventType {
  Upvote = "upvote",
  Downvote = "downvote",
}

export type GoalVote = GoalEvent["action"]["payload"] & {
  value: 1 | -1;
};

export enum GoalStatus {
  Uninitialized,

  TimerIdle,
  TimerRunning,
  TimerPaused,

  VotingIdle,
  VotingRunning,
  VotingPaused,
  VotingFinished,
}
