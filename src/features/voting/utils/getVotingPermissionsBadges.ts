import { SubTier } from "features/api/apiConstants";
import { Voting } from "features/api/apiTypes";
import type { Badge } from "../components/UserBadges";
import { FollowedTime } from "../votingConstants";

type Mode = "canVote" | "canAddOptions";

const SUB_TIER: Record<Mode, keyof Omit<Voting["permissions"]["sub"], Mode>> = {
  canVote: "subTierRequiredToVote",
  canAddOptions: "subTierRequiredToAddOptions",
};

const MINUTES_FOLLOWED: Record<
  Mode,
  keyof Omit<Voting["permissions"]["follower"], Mode>
> = {
  canVote: "minutesToFollowRequiredToVote",
  canAddOptions: "minutesToFollowRequiredToAddOptions",
};

const FOLLOWED_TIME_VALUES = {
  [FollowedTime.TenMinutes]: "от 10 минут",
  [FollowedTime.ThirtyMinutes]: "от 30 минут",
  [FollowedTime.OneHour]: "от 1 часа",
  [FollowedTime.OneDay]: "от 1 дня",
  [FollowedTime.OneWeek]: "от 1 недели",
  [FollowedTime.OneMonth]: "от 1 месяца",
  [FollowedTime.ThreeMonths]: "от 3 месяцев",
};

const getVotingPermissionsBadges = (
  { mod, vip, sub, follower, viewer }: Voting["permissions"],
  mode: Mode
): Badge[] => {
  const badges: Badge[] = [];

  if (viewer[mode]) {
    badges.push({ title: "Все зрители", name: "glhf-pledge" });

    return badges;
  }

  if (mod[mode]) badges.push({ title: "Модеры", name: "moderator" });
  // if (vip[mode]) badges.push({ title: "Випы", name: "vip" });

  if (sub[mode]) {
    const requiredTier = sub[SUB_TIER[mode]];
    let title: string;

    if (requiredTier === SubTier.Tier1) {
      title = "Сабы";
    } else if (requiredTier === SubTier.Tier2) {
      title = "Сабы (Уровень 2+)";
    } else if (requiredTier === SubTier.Tier3) {
      title = "Сабы (Уровень 3)";
    }

    badges.push({ title, name: "subscriber" });
  }

  if (follower[mode]) {
    const requiredMinutes = follower[MINUTES_FOLLOWED[mode]];
    const requiredMinutesText = FOLLOWED_TIME_VALUES[requiredMinutes];
    const title = requiredMinutesText
      ? `Фоллоферы (${requiredMinutesText})`
      : "Фоллоферы";

    badges.push({ title, name: "glitchcon2020" });
  }

  return badges;
};

export default getVotingPermissionsBadges;
