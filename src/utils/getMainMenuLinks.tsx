import PollIcon from "@mui/icons-material/Poll";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import { BroadcasterType } from "features/api/apiConstants";
import { User } from "features/api/apiTypes";

const ADMINS = process.env.NEXT_PUBLIC_ADMINS.split(";");

const getMainMenuLinks = (me: User) => {
  if (!me) return [];

  const isPartner = me.broadcasterType !== BroadcasterType.None;
  const isAdmin = ADMINS.includes(me.login);

  if (!isPartner && !isAdmin) return [];

  return [
    {
      label: "Голосование",
      href: `/${me.login}/voting`,
      IconComponent: PollIcon,
    },
    {
      label: "Голосование в чате",
      href: `/${me.login}/chat-voting`,
      IconComponent: PollIcon,
    },
    {
      label: "Чатгол",
      href: `/${me.login}/chat-goal`,
      IconComponent: ThumbsUpDownIcon,
    },
  ];
};

export default getMainMenuLinks;
