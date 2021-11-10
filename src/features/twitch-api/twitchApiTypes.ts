export type TwitchBadgesResponse = {
  badge_sets: BadgeSets;
};

export type BadgeSets = Record<string, Badge>;

export type Badge = {
  versions: Record<string, BadgeVersion>;
};

export type BadgeVersion = {
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  description: string;
  title: string;
  click_action: "none" | "subscribe_to_channel" | "turbo" | "visit_url";
  click_url: string;
  last_updated: null;
};
