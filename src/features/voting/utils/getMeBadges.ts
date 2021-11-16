import { SubTier } from "features/api/apiConstants";
import { User, UserRoles, Voting } from "features/api/apiTypes";
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
    let version = "0";

    if (meRoles.subTier === SubTier.Tier2) {
      title = "Саб (Уровень 2)";
      version = "2000";
    } else if (meRoles.subTier === SubTier.Tier2) {
      title = "Саб (Уровень 3)";
      version = "3000";
    }

    badges.push({ title, name: "subscriber", version });
  }

  if (meRoles.follower) {
    badges.push({ title: "Фоллофер", name: "glitchcon2020" });
  }

  return badges;
};

export default getMeBadges;
