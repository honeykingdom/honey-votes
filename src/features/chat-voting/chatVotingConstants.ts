import { ChatVoting, SubTier, TwitchUserType } from "features/api/types";

export const SUB_MONTHS = [
  { value: 0, title: "Subscriber" },
  { value: 3, title: "3-Month Subscriber" },
  { value: 6, title: "6-Month Subscriber" },
  { value: 12, title: "1-Year Subscriber" },
  { value: 24, title: "2-Year Subscriber" },
  { value: 36, title: "3-Year Subscriber" },
  { value: 48, title: "4-Year Subscriber" },
  { value: 54, title: "4.5-Year Subscriber" },
  { value: 60, title: "5-Year Subscriber" },
  { value: 66, title: "5.5-Year Subscriber" },
  { value: 72, title: "6-Year Subscriber" },
  { value: 78, title: "6.5-Year Subscriber" },
  { value: 84, title: "7-Year Subscriber" },
  { value: 90, title: "7.5-Year Subscriber" },
  { value: 96, title: "8-Year Subscriber" },
];

export const DEFAULT_CHAT_VOTING_PERMISSIONS: ChatVoting["permissions"] = {
  [TwitchUserType.Viewer]: false,
  [TwitchUserType.Sub]: true,
  [TwitchUserType.Mod]: true,
  [TwitchUserType.Vip]: true,
  subMonthsRequired: 0,
  subTierRequired: SubTier.Tier1,
};