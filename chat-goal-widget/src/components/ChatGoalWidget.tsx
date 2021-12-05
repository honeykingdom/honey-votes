import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import useGoal from "../hooks/useGoal";
import { Goal } from "../utils/types";
import { GoalStatus } from "../utils/constants";

const ChatGoalWidgetIndex = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-family: sans-serif;
  height: 320px;
  color: #f5f5f5;
`;
const Votes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
`;
const Vote = styled.div`
  padding: 2px 8px;

  &:not(:last-child) {
    margin-bottom: 4px;
  }
  &:nth-last-child(1) {
    background-color: #757575;
  }
  &:nth-last-child(2) {
    opacity: 0.9;
  }
  &:nth-last-child(3) {
    opacity: 0.75;
  }
  &:nth-last-child(4) {
    opacity: 0.6;
    color: #9e9e9e;
  }
  &:nth-last-child(5) {
    opacity: 0.45;
    color: #9e9e9e;
  }
  &:nth-last-child(6) {
    opacity: 0.3;
    color: #9e9e9e;
  }
`;
const Timer = styled.div`
  padding: 4px 8px;
  margin-bottom: 8px;
  background-color: #00e5ff;
`;
const ProgressBar = styled.div<{ $width: number; $completed: boolean }>`
  position: relative;
  padding: 4px 8px;
  margin-bottom: 8px;
  width: 240px;
  background-color: #757575;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${(p) => p.$width * 100}%;
    background-color: #ff5722;
  }
`;
const ProgressBarText = styled.div`
  position: relative;
  text-transform: uppercase;
  z-index: 1;
`;
const Title = styled.div`
  padding: 4px 8px;
  background-color: #d500f9;
  text-transform: uppercase;
`;

const parseTime = (time: number) => {
  const m = `${Math.floor(time / 60000)}`.padStart(2, "0");
  const s = `${Math.floor((time % 60000) / 1000)}`.padStart(2, "0");
  const ms = `${Math.floor(((time % 60000) % 1000) / 100)}`;

  return { m, s, ms };
};

const getGoalStatusText = (goal: Goal) => {
  if (!goal) return "";

  if (!goal.listening) return "Disabled";
  if (goal.status === GoalStatus.VotingIdle) return "Stopped";
  if (goal.status === GoalStatus.VotingPaused) return "Paused";
  if (goal.status === GoalStatus.VotingFinished) return "Completed";

  return "";
};

const ChatGoalWidget = (): any => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const isTimerRunningRef = useRef(false);
  const { goal, votes, setVotes } = useGoal();

  isTimerRunningRef.current = isTimerRunning;

  useEffect(() => {
    if (!goal) return;

    if (goal.status === GoalStatus.TimerIdle) {
      setIsTimerRunning(false);
      setTimer(goal.timerDuration);
      setVotes([]);
    }

    if (goal.status === GoalStatus.TimerRunning) {
      setIsTimerRunning(true);
    }

    if (goal.status === GoalStatus.TimerPaused) {
      setIsTimerRunning(false);
      setTimer(goal.remainingTimerDuration);
    }

    if (goal.status === GoalStatus.VotingIdle) {
      setIsTimerRunning(false);
      setVotes([]);
    }

    if (goal.status === GoalStatus.VotingRunning) {
      setIsTimerRunning(false);
    }

    if (goal.status === GoalStatus.VotingPaused) {
      setIsTimerRunning(false);
    }

    if (goal.status === GoalStatus.VotingFinished) {
      setIsTimerRunning(false);
    }
  }, [goal]);

  useEffect(() => {
    if (!goal || !isTimerRunning) return;

    const interval = setInterval(() => {
      if (isTimerRunningRef.current) {
        const timerValue = goal.endTimerTimestamp - Date.now();

        setTimer(timerValue < 0 ? 0 : timerValue);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!goal) return "Loading...";

  if (goal.status === GoalStatus.Uninitialized) return null;

  const isVotesVisible =
    goal.status === GoalStatus.VotingRunning ||
    goal.status === GoalStatus.VotingPaused ||
    goal.status === GoalStatus.VotingFinished;

  const isTimerVisible =
    goal.status === GoalStatus.TimerIdle ||
    goal.status === GoalStatus.TimerRunning ||
    goal.status === GoalStatus.TimerPaused;

  const isVotingVisible =
    goal.status === GoalStatus.VotingIdle ||
    goal.status === GoalStatus.VotingRunning ||
    goal.status === GoalStatus.VotingPaused ||
    goal.status === GoalStatus.VotingFinished;

  const goalStatusText = getGoalStatusText(goal);

  const renderVotes = () => (
    <Votes>
      {votes.map(({ value, votesCount, userLogin, userDisplayName }) => (
        <Vote key={userDisplayName}>
          <span style={{ fontSize: 16 }}>{value > 0 ? "✅" : "❌"}</span>{" "}
          {userDisplayName || userLogin} {votesCount > 1 && `x${votesCount}`}
        </Vote>
      ))}
    </Votes>
  );

  const renderTimer = () => {
    const time = parseTime(timer);

    return (
      <Timer>
        {time.m}:{time.s}.<small>{time.ms}</small>
      </Timer>
    );
  };

  const renderProgressBar = () => (
    <ProgressBar
      $width={goal.votesValue / goal.maxVotesValue}
      $completed={goal.votesValue >= goal.maxVotesValue}
    >
      <ProgressBarText>
        {goal.votesValue}/{goal.maxVotesValue}
        {goalStatusText ? ` (${goalStatusText})` : ""}
      </ProgressBarText>
    </ProgressBar>
  );

  return (
    <ChatGoalWidgetIndex>
      {isVotesVisible && renderVotes()}
      {isTimerVisible && renderTimer()}
      {isVotingVisible && renderProgressBar()}
      <Title>{goal.title || "Chat Goal"}</Title>
    </ChatGoalWidgetIndex>
  );
};

export default ChatGoalWidget;
