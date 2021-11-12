import PollIcon from "@mui/icons-material/Poll";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";

const getMainMenuLinks = (login: string) => [
  {
    label: "Голосование",
    href: `/${login}/voting`,
    IconComponent: PollIcon,
  },
  {
    label: "Голосование в чате",
    href: `/${login}/chat-voting`,
    IconComponent: PollIcon,
  },
  {
    label: "Чатгол",
    href: `/${login}/chat-goal`,
    IconComponent: ThumbsUpDownIcon,
  },
];

export default getMainMenuLinks;
