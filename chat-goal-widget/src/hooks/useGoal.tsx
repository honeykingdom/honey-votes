import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import parseSearchParams from "../utils/parseSearchParams";
import { Goal, GoalEvent, GoalVote } from "../utils/types";
import { GoalEventType } from "../utils/constants";

const MAX_VOTES_COUNT = 6;

const useGoal = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [votes, setVotes] = useState<GoalVote[]>([]);

  useEffect(() => {
    const { id } = parseSearchParams(window.location.search.slice(1));

    if (!id) return;

    (async () => {
      const response = await supabase
        .from<Goal>("hv_chat_goal")
        .select()
        .eq("broadcasterId", id);

      if (response.data) setGoal(response.data[0]);
    })();

    const goalSubscription = supabase
      .from<Goal>(`hv_chat_goal:broadcasterId=eq.${id}`)
      .on("*", (payload) => {
        if (payload.eventType === "DELETE") return;

        setGoal(payload.new);
      })
      .subscribe();

    const eventSubscription = supabase
      .from<GoalEvent>(`hv_chat_goal_event:chatGoalId=eq.${id}`)
      .on("*", (payload) => {
        if (payload.eventType === "DELETE") return;

        setVotes((prev) => {
          let value: GoalVote["value"] = 1;

          if (payload.new.action.type === GoalEventType.Upvote) value = 1;
          if (payload.new.action.type === GoalEventType.Downvote) value = -1;

          const vote = { ...payload.new.action.payload, value };
          const newVotes = [...prev, vote];

          if (newVotes.length === MAX_VOTES_COUNT) newVotes.shift();

          return newVotes;
        });
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(goalSubscription);
      supabase.removeSubscription(eventSubscription);
    };
  }, []);

  return { goal, votes };
};

export default useGoal;
