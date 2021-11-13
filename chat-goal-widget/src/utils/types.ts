import type {
  ChatGoal,
  ChatGoalEvent,
} from "../../../src/features/api/apiTypes";

export type Goal = ChatGoal;
export type GoalEvent = ChatGoalEvent;

export type GoalVote = GoalEvent["action"]["payload"] & {
  value: 1 | -1;
};
