import { SubTier, User, UserRoles, Voting } from "features/api/types";
import type { Badge } from "../components/UserBadges";

const getMeBadges = (me: User, meRoles: UserRoles): Badge[] => {
  const badges: Badge[] = [];

  if (!me || !meRoles) return badges;

  if (meRoles.broadcaster) {
    badges.push({ name: "broadcaster", title: "Стример" });
  }

  if (meRoles.editor) {
    badges.push({ name: "moderator", title: "Редактор" });
  }

  if (meRoles.mod) badges.push({ title: "Модер", name: "moderator" });
  // if (meRoles.vip) badges.push({ title: "Вип", name: "vip" });

  if (meRoles.sub) {
    let title = "Саб";

    if (meRoles.subTier === SubTier.Tier2) {
      title = "Саб (Уровень 2)";
    } else if (meRoles.subTier === SubTier.Tier2) {
      title = "Саб (Уровень 3)";
    }

    badges.push({ title, name: "subscriber" });
  }

  if (meRoles.follower) {
    badges.push({ title: "Фоллофер", name: "glitchcon2020" });
  }

  return badges;
};

export default getMeBadges;
